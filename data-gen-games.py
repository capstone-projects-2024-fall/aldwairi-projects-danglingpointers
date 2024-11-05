import json
import random
import datetime


def generate_game_entry(pk):
    mode = random.choice(["Solo", "Versus"])
    player_two = random.choice([True, False])
    return {
        "model": "api.Game",
        "pk": str(pk),
        "fields": {
            "mode": mode,
            "player_one": random.randint(0, 99),
            "player_two": random.randint(0, 99) if player_two else None,
            "public": random.choice([True, False]),
            "date": datetime.datetime.now().strftime("%Y-%m-%d"),
            "link": None,
            "status": random.choice(["Complete", "Active", "Pending"]) if mode == "Versus" else random.choice(["Complete", "Active"]),
            "game_length": random.randint(10, 5000),
            "player_one_score": random.randint(0, 1000),
            "player_two_score": random.randint(0, 1000) if player_two else None,
            "winner": random.choice([1, 2]) if player_two and random.choice([True, False]) else None,
            "trajectories": None
        }
    }


num_entries = 1000
games_data = [generate_game_entry(i) for i in range(num_entries)]

with open("./application/backend/api/fixtures/games_table.json", "w") as outfile:
    json.dump(games_data, outfile, indent=4)

print(f"Generated {num_entries} game entries and saved to games_table.json")
