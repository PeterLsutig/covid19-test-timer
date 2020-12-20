import {Component, OnInit} from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import {LocalStorage, LocalStorageService} from 'ngx-webstorage';
import {BehaviorSubject} from 'rxjs';
import {ButtonDialogService} from '../button-dialog/button-dialog.service';
import {IconSnackbarService} from '../icon-snackbar/icon-snackbar.service';
import {WindowService} from '../window.service';
import {COUNTER_KEY, FALLBACK_VALUES, Settings, SETTINGS_KEY} from '../settings-dialog/settings-dialog.component';


export const COVID_TEST_STORAGE_KEY = 'covid-timer-tests';

export interface CovidTest {

  name: string;

  state: 'Noch nicht gestartet' | 'Tupfer in Testlösung' | 'Testlösung auftragen!' | 'Test läuft' | 'Ergebnis ablesen!';

  duration1: number;
  duration2: number;

  phase1start?: number;
  phase2start?: number;

  phase1end?: number;
  phase2end?: number;
}


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{

  public currentTime: BehaviorSubject<number> = new BehaviorSubject<number>(Date.now()); // updated every second

  public covidTests: CovidTest[] = [];

  private settings: Settings;

  audio;
  audio_f;


  constructor(private breakpointObserver: BreakpointObserver, private storage: LocalStorageService,
              private btnDialogService: ButtonDialogService, private snackbarService: IconSnackbarService,
              public windowService: WindowService, private localSt: LocalStorageService) {}

  ngOnInit(): void {
    const savedSettings = this.localSt.retrieve(SETTINGS_KEY);
    this.settings = savedSettings
      ? savedSettings
      : FALLBACK_VALUES;

    this.localSt.observe(SETTINGS_KEY).subscribe((settings) => {
      this.settings = settings;
    });


    const savedCovidTests = this.localSt.retrieve(COVID_TEST_STORAGE_KEY);
    this.covidTests = savedCovidTests
      ? savedCovidTests
      : [];


    this.audio = new Audio();
    this.audio.src = '/assets/sounds/beep.wav';
    this.audio.load();
    this.audio_f = new Audio();
    this.audio_f.src = '/assets/sounds/beep_f.wav';
    this.audio_f.load();


    setInterval(() => this.currentTime.next(Date.now()), 1000);
    this.currentTime.subscribe(() => {
      // check for state change
      const currentTime = this.currentTime.value;
      // phase 1
      this.covidTests
        .filter( ctest => ctest.state === 'Tupfer in Testlösung')
        .filter( ctest => (currentTime - ctest.phase1start) / ctest.duration1 >= 1.0)
        .forEach( ctest => ctest.state = 'Testlösung auftragen!');
      const playBeepCondition = this.covidTests
        .filter( ctest => ctest.state === 'Testlösung auftragen!')
        .length > 0;
      if (playBeepCondition) {
        this.audio.play();
      }
      // phase 2
      this.covidTests
        .filter( ctest => ctest.state === 'Test läuft')
        .filter( ctest => (currentTime - ctest.phase2start) / ctest.duration2 >= 1.0)
        .forEach( ctest => ctest.state = 'Ergebnis ablesen!');
      const playBeepFCondition = this.covidTests
        .filter( ctest => ctest.state === 'Ergebnis ablesen!')
        .length > 0;
      if (playBeepFCondition) {
        this.audio_f.play();
      }
    });
  }


  addTest(): void {
    const covidTest: CovidTest = {
      name: `Test${this.getAndIncrementCounter()}`,
      state: 'Noch nicht gestartet',
      duration1: this.getPhase1Duration(),
      duration2: this.getPhase2Duration()
    };
    this.covidTests.push(covidTest);
    this.saveTestsToLocalStorage();
  }

  startPhase1(covidTest: CovidTest): void {
    covidTest.phase1start = Date.now();
    covidTest.phase1end = covidTest.phase1start + covidTest.duration1;
    covidTest.state = 'Tupfer in Testlösung';
    this.saveTestsToLocalStorage();
  }

  startPhase2(covidTest: CovidTest): void {
    covidTest.phase2start = Date.now();
    covidTest.phase2end = covidTest.phase1start + covidTest.duration1;
    covidTest.state = 'Test läuft';
    this.saveTestsToLocalStorage();
  }

  async resetTimer(covidTest: CovidTest, includeConfrimationDialog: boolean = this.settings.resetConfirmation): Promise<void> {
    let confirmation = true;
    if (includeConfrimationDialog) {
      confirmation = await this.btnDialogService
        .showConfirmDialog('Bestätigung', `Soll der Timer wirklich zurückgesetzt werden?`)
        .toPromise();
    }
    if (confirmation){
      switch (covidTest.state) {
        case 'Testlösung auftragen!':
        case 'Tupfer in Testlösung': {
          covidTest.phase1start = Date.now();
          this.startPhase1(covidTest);
          break;
        }
        case 'Ergebnis ablesen!':
        case 'Test läuft': {
          this.startPhase2(covidTest);
          break;
        }
        case 'Noch nicht gestartet':
        default: {
          this.snackbarService.failedSnackbar('Fehler');
        }
      }
      this.saveTestsToLocalStorage();
      this.snackbarService.successSnackbar('Timer zurückgesetzt');
    }
  }


  async deleteTimer(covidTest: CovidTest, includeConfirmationDialog: boolean = this.settings.deleteConfirmation): Promise<void> {
    let confirmation = true;
    if (covidTest.state !== 'Ergebnis ablesen!' && includeConfirmationDialog) {
      confirmation = await this.btnDialogService
        .showConfirmDialog('Bestätigung', 'Timer entfernen, obwohl der Test noch nicht fertig ist?')
        .toPromise();
    }
    if (confirmation){
      this.snackbarService.successSnackbar(`${covidTest.name} erfolgreich gelöscht`);
      this.covidTests.splice(this.covidTests.indexOf(covidTest), 1);
      this.saveTestsToLocalStorage();
    }
  }

  getPhase1Duration(): number{
    const {phase1min, phase1sec} = this.settings;
    return 1000 * 60 * phase1min + 1000 * phase1sec;
  }

  getPhase2Duration(): number {
    const {phase2min, phase2sec} = this.settings;
    return 1000 * 60 * phase2min + 1000 * phase2sec;
  }

  getAndIncrementCounter(): number{
    let curr = this.localSt.retrieve(COUNTER_KEY);
    curr = curr ? curr : 0;
    const next = curr + 1;
    this.localSt.store(COUNTER_KEY, next);
    return curr;
  }

  saveTestsToLocalStorage(covidTests: CovidTest[] = this.covidTests, key: string = COVID_TEST_STORAGE_KEY): void{
    this.localSt.store(key, covidTests);
  }


}
