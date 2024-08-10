import Api from "./Api";

export default {
  async login(payload) {
    return await Api().post("auth/login", payload);
  },

  async getAccessToken(refreshToken) {
    return await Api().post(`auth/access-token`, {
      refreshToken,
    });
  },

  // Admin
  async getTeacherDetails() {
    return await Api().get("/details");
  },

  // Courses
  async getAllCourses(params) {
    return await Api().get("/courses", { params });
  },

  async getSingleCourse(id) {
    return await Api().get("/course/" + id);
  },

  // Semesters
  async getAllSemesters(params) {
    return await Api().get("/semesters", { params });
  },

  async getSingleSemester(id) {
    return await Api().get("/semester/" + id);
  },

  // Subjects
  async getAllSubjects(params) {
    return await Api().get("/subjects", { params });
  },

  async getSingleSubject(id) {
    return await Api().get("/subject/" + id);
  },

  // Subject Types

  async getAllSubjectTypes(params) {
    return await Api().get("/subject-types", { params });
  },

  // Units
  async getAllUnits(params) {
    return await Api().get("/units", { params });
  },

  async getSingleUnit(id) {
    return await Api().get("/unit/" + id);
  },

  async saveUnit(payload) {
    return await Api().post("/unit", payload);
  },

  async deleteUnit(id) {
    return await Api().delete("/unit/" + id);
  },

  // Unit Materials
  async getAllUnitMaterials(params) {
    return await Api().get("/unit-material", { params });
  },

  async getSingleUnitMaterial(id) {
    return await Api().get("/unit-material/" + id);
  },

  async saveUnitMaterial(payload) {
    return await Api().post("/unit-material", payload);
  },

  async deleteUnitMaterial(id) {
    return await Api().delete("/unit-material/" + id);
  },

  // Unit Quizes
  async getAllUnitQuizes(params) {
    return await Api().get("/unit-quiz", { params });
  },

  async getSingleUnitQuiz(id) {
    return await Api().get("/unit-quiz/" + id);
  },

  async saveUnitQuiz(payload) {
    return await Api().post("/unit-quiz", payload);
  },

  async deleteUnitQuiz(id) {
    return await Api().delete("/unit-quiz/" + id);
  },

  // Batches
  async getAllBatches(params) {
    return await Api().get("/batches", { params });
  },

  async getSingleBatch(id) {
    return await Api().get("/batch/" + id);
  },

  // Divisions
  async getAllDivisions(params) {
    return await Api().get("/divisions", { params });
  },

  async getSingleDivision(id) {
    return await Api().get("/division/" + id);
  },

  // Teacher
  async getAllTeachers(params) {
    return await Api().get("/teachers", { params });
  },

  async getSingleTeacher(id) {
    return await Api().get("/teacher/" + id);
  },

  async saveTeacher(payload) {
    return await Api().post("/teacher", payload);
  },

  // Teacher Roles
  async getAllTeacherRoles(params) {
    return await Api().get("/teacher-roles", { params });
  },

  // Subject Divison Teachers
  async getAllTeacherDivisions(params) {
    return await Api().get("/teacher-divisions", { params });
  },

  async getTeahcerSubjectsByDivision(params) {
    return await Api().get("/teacher-subjects-by-division", { params });
  },

  // Student
  async getAllStudents(params) {
    return await Api().get("/students", { params });
  },

  async getSingleStudent(id) {
    return await Api().get("/student/" + id);
  },

  // Assignemnts
  async getAllAssignments(params) {
    return await Api().get("/assignments", { params });
  },

  async getSingleAssignment(id) {
    return await Api().get("/assignment/" + id);
  },

  async saveAssignment(payload) {
    return await Api().post("/assignment", payload);
  },

  async getStudentsByAssignment(assignment_id, params) {
    return await Api().get("/students-by-assignment/" + assignment_id, {
      params,
    });
  },

  async getSubmittedAssigment(submitted_assignment_id) {
    return await Api().get("/submitted-assignment/" + submitted_assignment_id);
  },

  // Assignemnts
  async getAllEvents(params) {
    return await Api().get("/events", { params });
  },

  async getSingleEvent(id) {
    return await Api().get("/event/" + id);
  },

  async saveEvent(payload) {
    return await Api().post("/event", payload);
  },

  async deleteEvent(id) {
    return await Api().delete("/event/" + id);
  },

  async joinEventOrganisers(payload) {
    return await Api().post("/join-event-organisers", payload);
  },

  async participateInEvent(payload) {
    return await Api().post("/join-event-participants", payload);
  },

  async removeFromEvent(eventParticipantId) {
    return await Api().delete(
      "/remove-event-participant/" + eventParticipantId
    );
  },

  async setEventOrganiserApprovalStatus(payload) {
    return await Api().post("/event-organisers-approval-status", payload);
  },

  async markEventComplete(eventId) {
    return await Api().post(`/mark-event-complete/${eventId}`);
  },

};
