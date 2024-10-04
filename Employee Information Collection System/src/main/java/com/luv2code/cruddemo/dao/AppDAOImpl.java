package com.luv2code.cruddemo.dao;

import com.luv2code.cruddemo.entity.Course;
import com.luv2code.cruddemo.entity.Instructor;
import com.luv2code.cruddemo.entity.InstructorDetail;
import com.luv2code.cruddemo.entity.Student;
import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class AppDAOImpl implements AppDAO {

    // define field for entity manager
    private EntityManager entityManager;

    // inject entity manager using constructor injection
    @Autowired
    public AppDAOImpl(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    @Override
    @Transactional
    public void save(Instructor theInstructor) {
        entityManager.persist(theInstructor);
    }

    @Override
    public Instructor findbyId(int Id) {
        return entityManager.find(Instructor.class,Id);
    }

    @Override
    @Transactional
    public void deleteById(int Id) {
        Instructor tempInstructor=findbyId(Id);

        //get course
        List<Course> courses=tempInstructor.getCourses();
        //break association of all courses for the instructor
        for (Course tempCourse: courses){
            tempCourse.setInstructor(null);
        }
        entityManager.remove(tempInstructor);
    }

    @Override
    public InstructorDetail finddetailById(int id) {
        return entityManager.find(InstructorDetail.class,id);
    }

    @Override
    @Transactional
    public void deleteDetailById(int Id) {
        InstructorDetail tempdetail=entityManager.find(InstructorDetail.class,Id);
        tempdetail.getInstructor().setInstructorDetail(null);
        entityManager.remove(tempdetail);
    }

    @Override
    public List<Course> findCourseByInstructorId(int theID) {
        //create query
        TypedQuery<Course> query = entityManager.createQuery(
                "from Course where instructor.id = :data", Course.class
        );
        query.setParameter("data",theID);
        //execute query
        List<Course> courses = query.getResultList();
        return courses;
    }

    @Override
    public Instructor findCourseByInstructorIdJoinFetch(int theID) {
        TypedQuery<Instructor> query = entityManager.createQuery(
                "select i from Instructor i JOIN FETCH i.courses where i.id=:data", Instructor.class
        );
        query.setParameter("data",theID);
        Instructor instructor=query.getSingleResult();
        return instructor;
    }

    @Override
    @Transactional
    public void updateInstructor(Instructor theInstructor) {
        entityManager.merge(theInstructor);
    }

    @Override
    @Transactional
    public void updateCourse(Course theCourse) {
        entityManager.merge(theCourse);
    }

    @Override
    public Course findCoursebyId(int theId) {
        return entityManager.find(Course.class,theId);
    }

    @Override
    @Transactional
    public void save(Course theCourse) {
        entityManager.persist(theCourse);
    }

    @Override
    public Course findCourseAndReviewsByCourseId(int theId) {
        TypedQuery<Course> query = entityManager.createQuery(
                "select c from Course c JOIN FETCH c.reviews where c.id = :data", Course.class
        );
        query.setParameter("data",theId);
        Course course = query.getSingleResult();
        return course;
    }

    @Override
    @Transactional
    public void deleteCourseById(int theId) {
        Course theCourse = entityManager.find(Course.class,theId);
        entityManager.remove(theCourse);
    }

    @Override
    public Course findCourseAndStudentByCourseId(int theId) {
        TypedQuery<Course> query = entityManager.createQuery(
                "select c from Course c JOIN FETCH c.students where c.id = :data", Course.class
        );
        query.setParameter("data",theId);
        Course course = query.getSingleResult();
        return course;
    }

    @Override
    public Student findCourseAndStudentByStudentId(int theId) {
        TypedQuery<Student> query = entityManager.createQuery(
                "select s from Student s JOIN FETCH s.courses where s.id = :data", Student.class
        );
        query.setParameter("data",theId);
        Student newStudent = query.getSingleResult();
        return newStudent;
    }

    @Override
    @Transactional
    public void update(Student newStudent) {
        entityManager.merge(newStudent);
    }

    @Override
    @Transactional
    public void deleteStudentById(int theId) {
        Student tempStudent = entityManager.find(Student.class,theId);
        entityManager.remove(tempStudent);
    }
}
