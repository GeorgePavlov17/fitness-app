import { Timestamp } from '@firebase/firestore-types';
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";
import { map } from 'rxjs/operators';
import { AngularFirestore } from "@angular/fire/compat/firestore";

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

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.db
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
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
    });
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
        this.db
        .collection<Exercise>('finishedExercises')
        .valueChanges()
        .subscribe((exercises: Exercise[] | unknown[]) => {
        const validExercises = exercises as Exercise[]; // Explicitly cast exercises to Exercise[]
        console.log(validExercises);
        this.finishedExercisesChanged.next(validExercises);
        });
    }


    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}