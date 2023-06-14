import { Timestamp } from '@firebase/firestore-types';
import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";
import { map } from 'rxjs/operators';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
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
        // this.availableExercises = exercises;
        // this.exercisesChanged.next([...this.availableExercises]);
    }, error => {
      this.store.dispatch(new UI.StoptLoading());
      this.uiService.showSnackbar('Fetching exercises failed!', '', 3000);
    }));
  }

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartTraining(selectedId))
    }

    completeExercise() {
      this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe((ex: Exercise[]) => {
        if (ex && ex.length === 1) {
          const exercise = ex[0];
          this.addDataToDatabase({ ...exercise, date: new Date(), state: 'completed' });
          this.store.dispatch(new Training.StopTraining());
        }
      });
    }

    cancelExercise(progress: number) {
      this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe((ex: Exercise[]) => {
        if (ex && ex.length === 1) {
          const exercise = ex[0];
          const updatedDuration = exercise.duration * (progress / 100);
          const updatedCalories = exercise.calories * (progress / 100);
          this.addDataToDatabase({ ...exercise, duration: updatedDuration, calories: updatedCalories, date: new Date(), state: 'completed' });
          this.store.dispatch(new Training.StopTraining());
        }
      });
    }

    fetchCompletedOrCancelledExercises() {
      this.fbSubs.push(
        this.db
          .collection<Exercise>('finishedExercises')
          .valueChanges()
          .subscribe((exercises: Exercise[]) => {
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