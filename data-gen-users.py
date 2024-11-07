import json
import random
import string


def generate_user_entry(pk):
    def generate_random_string(length):
        letters = string.ascii_letters
        result_str = ''.join(random.choice(letters) for i in range(length))
        return result_str

    return {
        "model": "auth.User",
        "pk": str(pk),
        "fields": {
            "username": f"{generate_random_string(random.randint(7, 15))}{str(pk)}",
            "first_name": generate_random_string(random.randint(4, 10)),
            "last_name": generate_random_string(random.randint(3, 10)),
            "email": f"{generate_random_string(random.randint(1, 10))}@sample.com",
            "password": "123456",
            "is_staff": False,
            "is_active": True,
            "is_superuser": False
        }
    }


num_entries = 100
games_data = [generate_user_entry(i) for i in range(num_entries)]

with open("./application/backend/api/fixtures/users_table.json", "w") as outfile:
    json.dump(games_data, outfile, indent=4)

print(f"Generated {num_entries} user entries and saved to users_table.json")
