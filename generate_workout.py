import sys
import json
import random

# Function to calculate the average difficulty level of exercises
def calculate_average_difficulty(exercises):
    total_difficulty = sum(exercise["difficulty"] for exercise in exercises)
    average_difficulty = total_difficulty / len(exercises) if exercises else 0
    return average_difficulty

# Function to select random exercises based on muscle group and difficulty level
def select_random_exercises(exercises, num_exercises, target_difficulty):
    filtered_exercises = [exercise for exercise in exercises if abs(exercise["difficulty"] - target_difficulty) <= 2]  # Adjust the tolerance level as needed
    selected_exercises = random.sample(filtered_exercises, min(num_exercises, len(filtered_exercises)))
    return selected_exercises

# Main function to generate a workout plan
def generate_workout(json_file_path, given_time, target_difficulty):
    with open(json_file_path) as file:
        exercises_data = json.load(file)
    
    compound_exercises = exercises_data["compound"]
    isolation_exercises = exercises_data["isolation"]
    
    # Calculate the number of compound and isolation exercises based on time
    time_per_set = 5  # Time per set in minutes
    sets_per_exercise = 3  # Number of sets per exercise
    total_time_per_exercise = time_per_set * sets_per_exercise
    total_exercises = min(len(compound_exercises) + len(isolation_exercises), given_time // total_time_per_exercise)
    num_compound_exercises = round(total_exercises * 0.6)  # Assuming 60% of exercises are compound
    num_isolation_exercises = total_exercises - num_compound_exercises
    
    # Calculate average difficulty level
    average_difficulty = (calculate_average_difficulty(compound_exercises) + calculate_average_difficulty(isolation_exercises)) / 2
    
    # Randomly select compound and isolation exercises based on difficulty level
    selected_compound_exercises = select_random_exercises(compound_exercises, num_compound_exercises, average_difficulty)
    selected_isolation_exercises = select_random_exercises(isolation_exercises, num_isolation_exercises, average_difficulty)
    
    # Combine selected exercises
    selected_exercises = selected_compound_exercises + selected_isolation_exercises
    
    return selected_exercises

# Extract command-line arguments
json_file_path = sys.argv[1]
given_time = int(sys.argv[2])  # Convert to integer
target_difficulty = int(sys.argv[3])  # Convert to integer

# Generate workout plan
workout_plan = generate_workout(json_file_path, given_time, target_difficulty)
# workout_plan = generate_workout("exercise_json/gym/exercises_back.json", 120, 5)

# Print the workout plan as JSON to stdout
print(json.dumps(workout_plan))
# print(json.dumps(workout_plan_test))