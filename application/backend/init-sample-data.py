import subprocess

def run_shell_script():
    commands = [
        "python manage.py makemigrations",
        "python manage.py migrate",
        "python manage.py loaddata security_questions items_table",
        "python manage.py loaddata users_table user_metadata user_friendships"
    ]

    for command in commands:
        subprocess.run(command, shell=True, check=True)

if __name__ == "__main__":
    run_shell_script()