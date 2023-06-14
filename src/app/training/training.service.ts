import { Timestamp } from '@firebase/firestore-types';
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";
import { map } from 'rxjs/operators';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import * as UI from '../shared/ui.actions';
import * as fromTraining from '../training/training.reducer';
import * as Training from '../training/training.actions';
import { Store } from '@ngrx/store';

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
    private uiService: UIService,
    private store: Store<fromTraining.State>
    ) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
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
        this.store.dispatch(new UI.StoptLoading());
        this.store.dispatch(new Training.SetAvailableTrainings(exercises));
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
    }, error => {
      this.store.dispatch(new UI.StoptLoading());
      this.uiService.showSnackbar('Fetching exercises failed!', '', 3000);
      this.exercisesChanged.next(null!);
    }));
  }

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId))
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
       this.store.dispatch(new Training.StopTraining());
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
      this.fbSubs.push(
        this.db
          .collection<Exercise>('finishedExercises')
          .valueChanges()
          .subscribe((exercises: Exercise[]) => { // Update the type to Exercise[]
            this.store.dispatch(new Training.SetFinishedTrainings(exercises));
          })
      );
    }

    cancelSubscriptions() {
      this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}