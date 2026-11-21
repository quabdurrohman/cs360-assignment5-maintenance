import assert from "node:assert/strict";
import { beforeEach, describe, test } from "node:test";
import { TranscriptStore } from "../src/transcriptStore.js";

describe("TranscriptStore", () => {
  let store;

  beforeEach(() => {
    store = new TranscriptStore();
  });

  test("adds students and returns their transcripts", () => {
    const studentID = store.addStudent("Ada");

    assert.equal(studentID, 1);
    assert.deepEqual(store.getTranscript(studentID), {
      student: { studentID, studentName: "Ada" },
      grades: [],
    });
  });

  test("adds and changes a course grade", () => {
    const studentID = store.addStudent("Lin");

    assert.deepEqual(store.addGrade(studentID, "cs360", "85"), {
      studentID,
      course: "CS360",
      grade: 85,
    });
    assert.deepEqual(store.changeGrade(studentID, "CS360", 92), {
      studentID,
      course: "CS360",
      grade: 92,
    });
  });

  test("rejects invalid student, course, and grade inputs", () => {
    const studentID = store.addStudent("Noah");

    assert.throws(() => store.addStudent("   "), /Student name is required/);
    assert.throws(() => store.addGrade(studentID, "", 90), /Course name is required/);
    assert.throws(
      () => store.addGrade(studentID, "CS360", 101),
      /Grade must be an integer from 0 to 100/,
    );
  });

  test("supports exact-name lookup and deletion", () => {
    const firstID = store.addStudent("Grace Lee");
    const secondID = store.addStudent("Grace Hall");

    assert.deepEqual(store.getStudentIDs("Grace Lee"), [firstID]);
    store.deleteStudent(secondID);
    assert.deepEqual(store.getStudentIDs(), [firstID]);
    assert.throws(() => store.deleteStudent(secondID), /Student not found/);
  });
  test("BUG-102 adding a grade to the course which already has grade should throw", () => {
  const id = store.addStudent("Abduraxmon");
  store.addGrade(id, "CS360", 74);

  assert.throws(() => store.addGrade(id, "CS360", 95), /Grade already exists for course CS360/);
  assert.equal(store.getGrade(id, "CS360"), 74);

  store.changeGrade(id, "CS360", 95);
  assert.equal(store.getGrade(id, "CS360"), 95);
});

  test("BUG-101: deleting a student removes their grades", () => {
    const store = new TranscriptStore()
    const id = store.addStudent("Abduraxmon")
    store.addGrade(id,"CS360",74);
    store.deleteStudent(id);
    assert.equal(store.getGrade(id,"CS360"),undefined)
  });
  test("BUG-103: name search trims whitespace and ignores case", () => {
  const id = store.addStudent("Bob");

  assert.deepEqual(store.getStudentIDs("bob"), [id]);
  assert.deepEqual(store.getStudentIDs("  BOB  "), [id]);

  assert.equal(store.getTranscript(id).student.studentName, "Bob");
});
});
