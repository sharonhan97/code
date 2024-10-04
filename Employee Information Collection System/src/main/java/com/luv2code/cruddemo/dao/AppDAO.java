package com.luv2code.cruddemo.dao;

import com.luv2code.cruddemo.entity.Course;
import com.luv2code.cruddemo.entity.Instructor;
import com.luv2code.cruddemo.entity.InstructorDetail;
import com.luv2code.cruddemo.entity.Student;

import java.util.List;

public interface AppDAO {
    void save(Instructor theInstructor);

    Instructor findbyId(int Id);

    void deleteById(int Id);

    InstructorDetail finddetailById(int id);

    void deleteDetailById(int Id);

    List<Course> findCourseByInstructorId(int theID);

    Instructor findCourseByInstructorIdJoinFetch(int theID);

    void updateInstructor(Instructor theInstructor);
    void updateCourse(Course theCourse);

    Course findCoursebyId(int theId);

    void save(Course theCourse);

    Course findCourseAndReviewsByCourseId(int theId);

    void deleteCourseById(int theId);

    Course findCourseAndStudentByCourseId(int theId);

    Student findCourseAndStudentByStudentId(int theId);

    void update(Student newStudent);

    void deleteStudentById(int theId);

}
