package com.luv2code.cruddemo;

import com.luv2code.cruddemo.dao.AppDAO;
import com.luv2code.cruddemo.entity.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.util.List;

@SpringBootApplication
public class CruddemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(CruddemoApplication.class, args);
	}

	@Bean
	public CommandLineRunner commandLineRunner(AppDAO appDAO){
		return runner->{
			//createCourseandStudent(appDAO);
			//findCoursesAndStudentById(appDAO);
			//findCoursesAndStudentByStudentid(appDAO);
			//addMoreCoursesforStudent(appDAO);
			//deleteCoursesAndReviewsById(appDAO);
			deleteStudentById(appDAO);


		};
	}

	private void deleteStudentById(AppDAO appDAO) {
		int theId=1;
		appDAO.deleteStudentById(theId);
		System.out.println("done");
	}


	private void addMoreCoursesforStudent(AppDAO appDAO) {
		int theId=2;
		Student tempStudent=appDAO.findCourseAndStudentByStudentId(theId);
		Course tempCourse1=new Course("English");
		Course tempCourse2=new Course("Science");
		tempStudent.addCourse(tempCourse1);
		tempStudent.addCourse(tempCourse2);
		appDAO.update(tempStudent);
		System.out.println("done");
	}


	private void findCoursesAndStudentByStudentid(AppDAO appDAO) {
		int theId=1;
		Student tempStudent = appDAO.findCourseAndStudentByStudentId(theId);
		System.out.println(tempStudent);
		System.out.println("course: "+tempStudent.getCourses());
		System.out.println("done");
	}

	private void findCoursesAndStudentById(AppDAO appDAO) {
		int theId=10;
		Course theCourse=appDAO.findCourseAndStudentByCourseId(theId);
		System.out.println(theCourse);
		System.out.println("student: "+theCourse.getStudents());
		System.out.println("done");

	}

	private void createCourseandStudent(AppDAO appDAO) {
		Course newCourse = new Course("math");

		Student student1 = new Student("Marry","Van","van@122.com");
		Student student2 = new Student("Kevin","Kong","kong@123.com");

		newCourse.addStudent(student1);
		newCourse.addStudent(student2);

		System.out.println("saving course"+newCourse);
		System.out.println("associated student"+newCourse.getStudents());

		appDAO.save(newCourse);
		System.out.println("done");

	}

	private void deleteCoursesAndReviewsById(AppDAO appDAO) {
		int theId=10;
		System.out.println("delete course and reviews");
		appDAO.deleteCourseById(theId);
		System.out.println("done!");
	}

	private void findCoursesAndReviewsById(AppDAO appDAO) {
		int theId=10;
		System.out.println("Find Course id: "+theId);
		System.out.println("Find Course and reviews");
		Course theCourse= appDAO.findCourseAndReviewsByCourseId(theId);
		System.out.println("Course: "+theCourse);
		System.out.println(theCourse.getReviews());
	}

	private void createCourseandReviews(AppDAO appDAO) {
		//create Course
		Course tempCourse = new Course("pacman-how to score");
		tempCourse.addReview(new Review("Greate Course!"));
		tempCourse.addReview(new Review("Cool Course"));
		tempCourse.addReview(new Review("What a dumb course"));

		//save the course
		appDAO.save(tempCourse);
		System.out.println("done!");


	}

	private void updateCourse(AppDAO appDAO) {
		int courseId=10;
		System.out.println("Finding course id: "+courseId);
		Course theCourse=appDAO.findCoursebyId(courseId);
		System.out.println("tempCourse: " +theCourse);
		System.out.println("update the course name");
		theCourse.setTitle("new");
		appDAO.updateCourse(theCourse);
		System.out.println("done");
	}

	private void updateInstructor(AppDAO appDAO) {
		int theId=1;
		System.out.println("Finding instructor id: "+theId);
		Instructor tempInstructor = appDAO.findbyId(theId);
		System.out.println("tempInstructor: "+tempInstructor);
		tempInstructor.setLastName("Tester");
		appDAO.updateInstructor(tempInstructor);

		System.out.println("done!");
	}

	private void findInstructorWithCoursesJoinFetch(AppDAO appDAO) {
		int theId=1;
		System.out.println("Finding instructor id: "+theId);
		Instructor tempInstructor = appDAO.findCourseByInstructorIdJoinFetch(theId);
		System.out.println("tempInstructor: "+tempInstructor);
		System.out.println("the associated courses: " + tempInstructor.getCourses());
		System.out.println("Done!");
	}

	private void findCoursesforInstructor(AppDAO appDAO) {
		int theId=1;
		System.out.println("Finding instructor id: "+theId);
		Instructor tempInstructor = appDAO.findbyId(theId);
		System.out.println("tempInstructor: "+tempInstructor);
		System.out.println("Finding courses for instructor id: "+theId);
		List<Course> courses = appDAO.findCourseByInstructorId(theId);
		tempInstructor.setCourses(courses);
		System.out.println("the associated courses: " + tempInstructor.getCourses());
		System.out.println("done!");
	}

	private void findInstructorWithCourses(AppDAO appDAO) {
		int theId=1;
		System.out.println("Finding instructor id: "+theId);
		Instructor tempInstructor = appDAO.findbyId(theId);
		System.out.println("tempInstructor: "+tempInstructor);
		System.out.println("the associated courses: " + tempInstructor.getCourses());
		System.out.println("Done!");

	}

	private void createInstructorWithCourses(AppDAO appDAO) {
		Instructor tempInstructor=new Instructor("chad","Darty","darty@gmail.com");
		InstructorDetail tempInstructorDetail=new InstructorDetail("http://www.sss.com/youtube","yeah");
		Course newCourse1 = new Course("Math");
		Course newCourse2 = new Course("English");
		Course newCourse3 = new Course("Science");
		tempInstructor.setInstructorDetail(tempInstructorDetail);
		tempInstructor.add(newCourse1);
		tempInstructor.add(newCourse2);
		tempInstructor.add(newCourse3);
		System.out.println("Saving Instructor with course: "+tempInstructor);
		appDAO.save(tempInstructor);
		System.out.println("Saved!!");
	}

	private void createInstructor(AppDAO appDAO) {
		Instructor tempInstructor=new Instructor("chad","Darty","darty@gmail.com");
		InstructorDetail tempInstructorDetail=new InstructorDetail("http://www.sss.com/youtube","yeah");
		tempInstructor.setInstructorDetail(tempInstructorDetail);
		System.out.println("Saving Instructor: "+tempInstructor);
		appDAO.save(tempInstructor);
		System.out.println("Saved!!");
	}

	private void findInstructor(AppDAO appDAO){
		int theId=1;

		System.out.println("find instructor by id: "+theId);

		Instructor tempInstructor= appDAO.findbyId(theId);
		System.out.println(tempInstructor);
	}

	private void deleteInstructor(AppDAO appDAO){
		int theId=1;
		System.out.println("delete instructor by Id: "+theId);
		appDAO.deleteById(theId);
		System.out.println("Instructor Deleted");
	}

	private void findInstructorDetail(AppDAO appDAO){
		int theId=2;
		InstructorDetail tempdetail=appDAO.finddetailById(theId);
		System.out.println(tempdetail);
		System.out.println(tempdetail.getInstructor());
	}

	private void deleteInstructorDetail(AppDAO appDAO){
		int theId=4;
		System.out.println("delete instructor detail by Id: "+theId);
		appDAO.deleteDetailById(theId);
		System.out.println("Instructor detail Deleted");
	}



}
