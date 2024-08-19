import os, json


def exercise_count(json_path, single_muscle=False):
    '''
    Finds number of exercises inside a json file

    Arguments:
        json_path (str): Path to json file
        single_muscle (bool): Whether json file contains a single muscle group
    Returns:
        count (int): Number of exercises in json file
    '''

    with open(json_path, 'r') as json_file:
        json_data = json.load(json_file)

        count = 0

        if not single_muscle:
            for muscle_group in json_data.values():
                for exercise_type in muscle_group.values():
                    count += len(exercise_type)
        else:
            for exercise_type in json_data.values():
                count += len(exercise_type)
    
    return count


total_count = 0
json_paths = []

# Add JSON paths
calisthenics = os.path.join(os.path.dirname(__file__), 'calisthenics', 'exercises.json')
gym = os.path.join(os.path.dirname(__file__), 'gym', 'exercises.json')
gym_back = os.path.join(os.path.dirname(__file__), 'gym', 'exercises_back.json')

# Find total count and print
total_count += exercise_count(json_path=calisthenics)
print(total_count)
total_count += exercise_count(json_path=gym)
print(total_count)
total_count += exercise_count(json_path=gym_back, single_muscle=True)

print(total_count)
