# study-helpoo-
import json
from pathlib import Path
from datetime import datetime


DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday"
]


def get_positive_int(prompt):
    """Get a positive integer from the user."""

    while True:
        try:
            value = int(input(prompt))

            if value > 0:
                return value

            print("Please enter a number greater than 0.")

        except ValueError:
            print("Please enter a valid whole number.")


def get_priority():
    """Get a priority between 1 and 5."""

    while True:
        try:
            priority = int(
                input("Priority (1 = low, 5 = high): ")
            )

            if 1 <= priority <= 5:
                return priority

            print("Priority must be between 1 and 5.")

        except ValueError:
            print("Please enter a valid number.")


def collect_subjects():
    """Collect subjects and their study requirements."""

    subjects = []

    number = get_positive_int(
        "\nHow many subjects do you have? "
    )

    for i in range(number):

        print(f"\n--- Subject {i + 1} ---")

        name = input("Subject name: ").strip()

        while not name:
            print("Subject name cannot be empty.")
            name = input("Subject name: ").strip()

        priority = get_priority()

        hours = get_positive_int(
            "Study hours required this week: "
        )

        subjects.append({
            "name": name,
            "priority": priority,
            "hours": hours
        })

    return subjects


def create_schedule(subjects):
    """Create a weekly study schedule."""

    # High-priority subjects are scheduled first.
    subjects = sorted(
        subjects,
        key=lambda subject: (
            -subject["priority"],
            -subject["hours"]
        )
    )

    remaining_hours = {
        subject["name"]: subject["hours"]
        for subject in subjects
    }

    schedule = {
        day: []
        for day in DAYS
    }

    current_day = 0
    previous_subject = None

    while sum(remaining_hours.values()) > 0:

        available = [
            subject
            for subject in subjects
            if remaining_hours[subject["name"]] > 0
            and subject["name"] != previous_subject
        ]

        # If every remaining subject is the same as the previous one,
        # allow it so the schedule can finish.
        if not available:
            available = [
                subject
                for subject in subjects
                if remaining_hours[subject["name"]] > 0
            ]

        selected = max(
            available,
            key=lambda subject: (
                subject["priority"],
                remaining_hours[subject["name"]]
            )
        )

        day = DAYS[current_day % len(DAYS)]

        schedule[day].append(selected["name"])

        remaining_hours[selected["name"]] -= 1

        previous_subject = selected["name"]

        current_day += 1

    return schedule


def display_schedule(schedule):
    """Display the schedule in a readable format."""

    print("\n")
    print("=" * 60)
    print("                 SMART STUDY PLANNER")
    print("=" * 60)

    for day, subjects in schedule.items():

        print(f"\n{day}")

        print("-" * 30)

        if subjects:
            for number, subject in enumerate(subjects, start=1):
                print(f"  {number}. {subject}")
        else:
            print("  Rest day")


def save_schedule(schedule):
    """Save the schedule to a JSON file."""

    file_name = "study_plan.json"

    data = {
        "created_at": datetime.now().strftime(
            "%Y-%m-%d %H:%M:%S"
        ),
        "schedule": schedule
    }

    Path(file_name).write_text(
        json.dumps(data, indent=4),
        encoding="utf-8"
    )

    print(f"\n✓ Study plan saved to {file_name}")


def main():
    """Main program."""

    print("=" * 60)
    print("              WELCOME TO SMART STUDY PLANNER")
    print("=" * 60)

    print(
        "\nCreate a personalized weekly study schedule."
    )

    subjects = collect_subjects()

    schedule = create_schedule(subjects)

    display_schedule(schedule)

    save_schedule(schedule)

    print("\n✓ Your study plan is ready!")
    print("Good luck with your studies!")


if __name__ == "__main__":
    main()
