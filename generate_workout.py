import sys
import json
import random

# Function to select random exercises based on muscle group
def select_random_exercises(exercises, num_exercises):
    selected_exercises = random.sample(exercises, min(num_exercises, len(exercises)))
    return selected_exercises

# Main function to generate a workout plan
def generate_workout(json_file_path, num_exercises, target_muscle_group):
    with open(json_file_path) as file:
        exercises = json.load(file)
    selected_exercises = select_random_exercises(exercises, num_exercises)
    return selected_exercises


# Extract command-line arguments
json_file_path = sys.argv[1]
num_exercises = int(sys.argv[2])
target_muscle_group = sys.argv[3]

# Generate workout plan
workout_plan = generate_workout(json_file_path, num_exercises, target_muscle_group)

# Print the workout plan as JSON to stdout
print(json.dumps(workout_plan))