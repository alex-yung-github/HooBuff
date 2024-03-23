import json
import random
import sys

muscle_groups = {
    "triceps": ["long head", "lateral head", "medial head"],
    "biceps": ["long head", "short head"],
    "back": ["latissimus dorsi", "trapezius", "rhomboids", "erector spinae", "teres major", "teres minor"],
    "chest": ["pectoralis major upper", "pectoralis major middle", "pectoralis major lower", "serratus anterior"],
    "shoulders": ["deltoid anterior", "deltoid lateral", "deltoid posterior", "rotator cuff supraspinatus", "rotator cuff infraspinatus", "rotator cuff teres minor", "rotator cuff subscapularis"],
    "abs": ["rectus abdominis", "obliques", "transversus abdominis"],
    "legs": ["quadriceps", "hamstrings", "glutes", "calves"]
}

ISOLATION_SETS = 3
COMPOUND_SETS = 4
TIME_PER_SET = 4

# Function to convert all keys of a dictionary to lowercase
def convert_dict_keys_to_lowercase(input_dict):
    return {key.lower(): value for key, value in input_dict.items()}

# Convert muscle_groups to lowercase keys
muscle_groups = convert_dict_keys_to_lowercase(muscle_groups)

#Gives more specific muscle groups
def expand_muscle_groups(muscle_groups_desired):
    specific_muscles = []
    for muscle_group in muscle_groups_desired:
        specific_muscles.extend(muscle_groups.get(muscle_group.lower(), []))
    return specific_muscles

# Function to calculate the average difficulty level of exercises
def calculate_average_difficulty(exercises):
    total_difficulty = sum(exercise["difficulty"] for exercise in exercises)
    average_difficulty = total_difficulty / len(exercises) if exercises else 0
    return average_difficulty

# Function to select random exercises based on muscle group and difficulty level
def select_exercises(exercises, num_exercises, target_difficulty, expanded_muscle_groups):
    filtered_exercises = [exercise for exercise in exercises if abs(exercise["difficulty"] - target_difficulty) <= 2]  # Adjust the tolerance level as needed
    
    toReturn = []
    maxScore = -1
    for i in range(5):
        selected_exercises = random.sample(filtered_exercises, min(num_exercises, len(filtered_exercises)))
        already_targeted = []
        score = 0
        for s in selected_exercises:
            muscle = s["muscles_targeted"]
            for m in muscle:
                m = m.lower()
                if(m in expanded_muscle_groups):
                    if(m not in already_targeted):
                        score += 5
                        already_targeted.append(m)
                    else:
                        score += 1
        if(score > maxScore):
            maxScore = score
            toReturn = selected_exercises     
    return toReturn

# Main function to generate a workout plan
def generate_workout(json_file_path, given_time, target_difficulty, muscle_groups_desired):
    with open(json_file_path) as file:
        exercise_data = json.load(file)
    
    compound_exercises = []
    isolation_exercises = []
    
    # Extract exercises based on the desired muscle groups
    for muscle_group in muscle_groups_desired:
        compound_exercises.extend(exercise_data[muscle_group]["compound"])
        isolation_exercises.extend(exercise_data[muscle_group]["isolation"])
    
    # Calculate the number of compound and isolation exercises based on time
    time_per_set = TIME_PER_SET  # Time per set in minutes
    sets_per_exercise_isolation = ISOLATION_SETS  # Number of sets per exercise
    sets_per_exercise_compound = COMPOUND_SETS  # Number of sets per exercise
    avg_total_time_per_exercise = time_per_set * (sets_per_exercise_compound + sets_per_exercise_isolation + 1.0 - 1.0)/2
    total_exercises = round(min(len(compound_exercises) + len(isolation_exercises), given_time // avg_total_time_per_exercise))
    num_compound_exercises = round(total_exercises * 0.6)  # Assuming 60% of exercises are compound
    num_isolation_exercises = total_exercises - num_compound_exercises
    
    # Calculate average difficulty level
    average_difficulty = (calculate_average_difficulty(compound_exercises) + calculate_average_difficulty(isolation_exercises)) / 2
    
    #Find expanded muscle groups
    specific_muscles = expand_muscle_groups(muscle_groups_desired)

    # Randomly select compound and isolation exercises based on difficulty level
    selected_compound_exercises = select_exercises(compound_exercises, num_compound_exercises, average_difficulty, specific_muscles)
    for i in selected_compound_exercises:
        i["sets"] = 4
    selected_isolation_exercises = select_exercises(isolation_exercises, num_isolation_exercises, average_difficulty, specific_muscles)
    for i in selected_isolation_exercises:
        i["sets"] = 3
    # Combine selected exercises
    selected_exercises = selected_compound_exercises + selected_isolation_exercises
    
    return selected_exercises

# Extract input arguments from the command line
json_file_path = sys.argv[1]  # Path to the JSON file containing exercise data
given_time = int(sys.argv[2])  # Total workout time in minutes
target_difficulty = int(sys.argv[3])  # Target difficulty level
muscle_groups_desired = json.loads(sys.argv[4])  # List of desired overall muscle groups
muscle_groups_desired = muscle_groups_desired.split(",")

# Generate workout plan
workout_plan = generate_workout(json_file_path, given_time, target_difficulty, muscle_groups_desired)

# For testing
# muscle_groups_desired = ["back", "triceps"]
# workout_plan = generate_workout("exercise_json/gym/exercises.json", 70, 5, muscle_groups_desired)

# Print the workout plan as JSON to stdout
print(json.dumps(workout_plan))