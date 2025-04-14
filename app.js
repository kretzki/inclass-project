// Task 1: Creating/Storing data
const teams = [
  {
    name: "Real Madrid",
    city: "Madrid",
    country: "Spain",
    top_scorers: ["Ronaldo", "Benzema", "Hazard"],
    worldwide_fans: 798,
  },
  {
    name: "Barcelona",
    city: "Barcelona",
    country: "Spain",
    top_scorers: ["Messi", "Suarez", "Puyol"],
    worldwide_fans: 738,
  },
  {
    name: "Manchester United",
    city: "Manchester",
    country: "England",
    top_scorers: ["Cantona", "Rooney", "Ronaldo"],
    worldwide_fans: 755,
  },
  {
    name: "Manchester City",
    city: "Manchester",
    country: "England",
    top_scorers: ["Sterling", "Aguero", "Haaland"],
    worldwide_fans: 537,
  },
  {
    name: "Brazil National Team",
    city: "Not applicable",
    country: "Brazil",
    top_scorers: ["Ronaldinho", "Cafu", "Bebeto"],
    worldwide_fans: 950,
  },
  {
    name: "Argentina National Team",
    city: "Not applicable",
    country: "Argentina",
    top_scorers: ["Messi", "Batistuta", "Maradona"],
    worldwide_fans: 888,
  },
  {
    name: "Atletico Madrid",
    city: "Madrid",
    country: "Spain",
    top_scorers: ["Aragonés", "Griezmann", "Torez"],
    worldwide_fans: 400,
  },
];

// Adding the teams to Firestore (Uncomment to add to Firestore)
// teams.forEach((team) => {
//   db.collection("teams")
//     .add(team)
//     .then((docRef) => {
//       console.log("Document written with ID: ", docRef.id);
//     })
//     .catch((error) => {
//       console.error("Error adding document: ", error);
//     });
// });

// Task 2: Querying Data
function queryTeams() {
  // Helper function to display results
  function display(title, teams) {
    const resultsDiv = document.getElementById("results");
    const heading = document.createElement("h2");
    heading.textContent = title;
    resultsDiv.appendChild(heading);

    // Removing duplicate teams by using a Set (team names must be unique)
    const uniqueTeams = Array.from(new Set(teams.map((team) => team.name))).map(
      (name) => teams.find((team) => team.name === name)
    );

    // Display only the team names
    uniqueTeams.forEach((team) => {
      const teamElement = document.createElement("p");
      teamElement.textContent = team.name; // Only show team name
      resultsDiv.appendChild(teamElement);
    });
  }

  // 1. Show all teams in Spain
  db.collection("teams")
    .where("country", "==", "Spain")
    .get()
    .then((spainTeamsSnap) => {
      const spainTeams = spainTeamsSnap.docs.map((doc) => doc.data());
      display("1. Teams in Spain", spainTeams);
    });

  // 2. Show all teams in Madrid, Spain
  db.collection("teams")
    .where("country", "==", "Spain")
    .where("city", "==", "Madrid")
    .get()
    .then((madridTeamsSnap) => {
      const madridTeams = madridTeamsSnap.docs.map((doc) => doc.data());
      display("2. Teams in Madrid, Spain", madridTeams);
    });

  // 3. Show all national teams
  db.collection("teams")
    .where("city", "==", "Not applicable")
    .get()
    .then((nationalTeamsSnap) => {
      const nationalTeams = nationalTeamsSnap.docs.map((doc) => doc.data());
      display("3. National Teams", nationalTeams);
    });

  // 4. Show all teams that are not in Spain
  db.collection("teams")
    .where("country", "!=", "Spain")
    .get()
    .then((notSpainTeamsSnap) => {
      const notSpainTeams = notSpainTeamsSnap.docs.map((doc) => doc.data());
      display("4. Teams not in Spain", notSpainTeams);
    });

  // 5. Show all teams that are not in Spain or England
  db.collection("teams")
    .where("country", "not-in", ["Spain", "England"])
    .get()
    .then((notInSpainOrEnglandTeamsSnap) => {
      const notInSpainOrEnglandTeams = notInSpainOrEnglandTeamsSnap.docs.map(
        (doc) => doc.data()
      );
      display("5. Teams not in Spain or England", notInSpainOrEnglandTeams);
    });

  // 6. Show all teams in Spain with more than 700M fans
  db.collection("teams")
    .where("worldwide_fans", ">=", 700)
    .get()
    .then((teamsWithMoreThan700MFansSnap) => {
      const teamsWithMoreThan700MFans = teamsWithMoreThan700MFansSnap.docs.map(
        (doc) => doc.data()
      );
      display(
        "6. Teams in Spain with more than 700M fans",
        teamsWithMoreThan700MFans
      );
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  // 7. Show all teams with a number of fans in the range of 500M and 600M
  db.collection("teams")
    .where("worldwide_fans", ">=", 500)
    .where("worldwide_fans", "<=", 600)
    .get()
    .then((teamsWithFansInRangeSnap) => {
      const teamsWithFansInRange = teamsWithFansInRangeSnap.docs.map((doc) =>
        doc.data()
      );
      display("7. Teams with 500M–600M fans", teamsWithFansInRange);
    });

  // 8. Show all teams where Ronaldo is a top scorer
  db.collection("teams")
    .where("top_scorers", "array-contains", "Ronaldo")
    .get()
    .then((teamsWithRonaldoSnap) => {
      const teamsWithRonaldo = teamsWithRonaldoSnap.docs.map((doc) =>
        doc.data()
      );
      display("8. Teams where Ronaldo is a top scorer", teamsWithRonaldo);
    });

  // 9. Show all teams where Ronaldo, Maradona, or Messi is a top scorer
  db.collection("teams")
    .where("top_scorers", "array-contains-any", [
      "Ronaldo",
      "Maradona",
      "Messi",
    ])
    .get()
    .then((teamsWithRonaldoMaradonaOrMessiSnap) => {
      const teamsWithRonaldoMaradonaOrMessi =
        teamsWithRonaldoMaradonaOrMessiSnap.docs.map((doc) => doc.data());
      display(
        "9. Teams where Ronaldo, Maradona, or Messi is a top scorer",
        teamsWithRonaldoMaradonaOrMessi
      );
    });
}

// Execute the query function for Task 2
queryTeams();

// Task 3: Updating Data

// 1. Update Real Madrid's name and worldwide fans count
db.collection("teams")
  .where("name", "==", "Real Madrid")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      doc.ref.update({
        name: "Real Madrid FC",
        worldwide_fans: 811,
      });
    });
  });

// 2. Update Barcelona's name and worldwide fans count
db.collection("teams")
  .where("name", "==", "Barcelona")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      doc.ref.update({
        name: "FC Barcelona",
        worldwide_fans: 747,
      });
    });
  });

// 3. Update Real Madrid's top scorers: Remove "Hazard", add "Crispo"
db.collection("teams")
  .where("name", "==", "Real Madrid FC")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      let scorers = doc.data().top_scorers;
      scorers = scorers.filter((s) => s !== "Hazard"); // Remove Hazard
      scorers.push("Crispo"); // Add Crispo

      // Ensure there are exactly 3 top scorers
      scorers = scorers.slice(0, 3); // Keep only the first 3 scorers

      doc.ref.update({
        top_scorers: scorers,
      });
    });
  });

// 4. Update Barcelona's top scorers: Remove "Puyol", add "Deco"
db.collection("teams")
  .where("name", "==", "FC Barcelona")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      let scorers = doc.data().top_scorers;
      scorers = scorers.filter((s) => s !== "Puyol"); // Remove Puyol
      scorers.push("Deco"); // Add Deco

      // Ensure there are exactly 3 top scorers
      scorers = scorers.slice(0, 3); // Keep only the first 3 scorers

      doc.ref.update({
        top_scorers: scorers,
      });
    });
  });

// 5. Add jersey colors to Real Madrid (home: White, away: Black)
db.collection("teams")
  .where("name", "==", "Real Madrid FC")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      doc.ref.update({
        color: {
          home: "White",
          away: "Black",
        },
      });
    });
  });

// 6. Add jersey colors to Barcelona (home: Red, away: Gold)
db.collection("teams")
  .where("name", "==", "FC Barcelona")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      doc.ref.update({
        color: {
          home: "Red",
          away: "Gold",
        },
      });
    });
  });

// 7. Change away jersey color for Real Madrid to Purple
db.collection("teams")
  .where("name", "==", "Real Madrid FC")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      doc.ref.update({
        "color.away": "Purple",
      });
    });
  });

// 8. Change away jersey color for Barcelona to Pink
db.collection("teams")
  .where("name", "==", "FC Barcelona")
  .get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      doc.ref.update({
        "color.away": "Pink",
      });
    });
  });
