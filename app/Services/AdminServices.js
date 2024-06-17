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
  async getAdminDetails() {
    return await Api().get("/details");
  },

  // Courses
  async getAllCourses(params) {
    return await Api().get("/courses", { params });
  },

  async getSingleCourse(id) {
    return await Api().get("/course/" + id);
  },

  async saveCourse(payload) {
    return await Api().post("/course", payload);
  },

  async deleteCourse(id) {
    return await Api().delete("/course/" + id);
  },

  // Semesters
  async getAllSemesters(params) {
    return await Api().get("/semesters", { params });
  },

  async getSingleSemester(id) {
    return await Api().get("/semester/" + id);
  },

  async saveSemester(payload) {
    return await Api().post("/semester", payload);
  },

  async deleteSemester(id) {
    return await Api().delete("/semester/" + id);
  },

  // Subjects
  async getAllSubjects(params) {
    return await Api().get("/subjects", { params });
  },

  async getSingleSubject(id) {
    return await Api().get("/subject/" + id);
  },

  async saveSubject(payload) {
    return await Api().post("/subject", payload);
  },

  async deleteSubject(id) {
    return await Api().delete("/subject/" + id);
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

  async saveBatch(payload) {
    return await Api().post("/batch", payload);
  },

  async deleteBatch(id) {
    return await Api().delete("/batch/" + id);
  },

  // Divisions
  async getAllDivisions(params) {
    return await Api().get("/divisions", { params });
  },

  async getSingleDivision(id) {
    return await Api().get("/division/" + id);
  },

  async saveDivision(payload) {
    return await Api().post("/division", payload);
  },

  async deleteDivision(id) {
    return await Api().delete("/division/" + id);
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

  async deleteTeacher(id) {
    return await Api().delete("/teacher/" + id);
  },

  // Subject Divison Teachers
  async getAllDivisionSubjectTeachers(params) {
    return await Api().get("/division-subject-teachers", { params });
  },

  async saveDivisionSubjectTeacher(payload) {
    return await Api().post("/division-subject-teacher", payload);
  },

  // Student
  async getAllStudents(params) {
    return await Api().get("/students", { params });
  },

  async getSingleStudent(id) {
    return await Api().get("/student/" + id);
  },

  async saveStudent(payload) {
    return await Api().post("/student", payload);
  },

  async deleteStudent(id) {
    return await Api().delete("/student/" + id);
  },

  // ----------------- Masters -------------------------
  // Teacher Roles
  async getAllTeacherRoles(params) {
    return await Api().get("/teacher-roles", { params });
  },

  async getSingleTeacherRole(id) {
    return await Api().get("/teacher-role/" + id);
  },

  async saveTeacherRole(payload) {
    return await Api().post("/teacher-role", payload);
  },

  async deleteTeacherRole(id) {
    return await Api().delete("/teacher-role/" + id);
  },

  // Student Documents
  async getAllStudentDocuments(params) {
    return await Api().get("/student-documents", { params });
  },

  async getSingleStudentDocument(id) {
    return await Api().get("/student-document/" + id);
  },

  async saveStudentDocument(payload) {
    console.log("here");
    return await Api().post("/student-document", payload);
  },

  async deleteStudentDocument(id) {
    return await Api().delete("/student-document/" + id);
  },
};
