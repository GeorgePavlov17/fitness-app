import { Exercise } from "./exercise.model";

export class TrainingService {
    private availableExercises: Exercise[] = [
        { id: 'biceps', name: 'Biceps', duration: 20, calories: 20 },
        { id: 'triceps', name: 'Triceps', duration: 20, calories: 20 },
        { id: 'back', name: 'Back', duration: 30, calories: 40 },
        { id: 'legs', name: 'Legs', duration: 30, calories: 50 },
    ];

    getAvailableExercises() {
        return this.availableExercises.slice();
    }
}