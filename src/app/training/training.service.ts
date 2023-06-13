import { Timestamp } from '@firebase/firestore-types';
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";
import { map } from 'rxjs/operators';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';

interface ExerciseData {
    name: string;
    duration: number;
    calories: number;
    date: Timestamp;
    state: string;
    // add any other properties we have in our Exercise model
  }

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise | null>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise | any;
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService
    ) {}

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            const exerciseData = doc.payload.doc.data() as ExerciseData;
            return {
              id: doc.payload.doc.id,
              name: exerciseData.name,
              duration: exerciseData.duration,
              calories: exerciseData.calories,
            };
          });
        })
      )
      .subscribe((exercises: Exercise[]) => {
        this.uiService.loadingStateChanged.next(false);
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
    }, error => {
      this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackbar('Fetching exercises failed!', '', 3000);
      this.exercisesChanged.next(null!);
    }));
  }

    startExercise(selectedId: string) {
        // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()})
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({...this.runningExercise, date: new Date(), state: 'completed'});
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(), 
            state: 'cancelled'});
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(this.db
        .collection<Exercise>('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[] | unknown[]) => {
        const validExercises = exercises as Exercise[]; // Explicitly cast exercises to Exercise[]
        console.log(validExercises);
        this.finishedExercisesChanged.next(validExercises);
        }));
    }

    cancelSubscriptions() {
      this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}