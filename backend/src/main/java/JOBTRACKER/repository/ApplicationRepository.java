package JOBTRACKER.repository;

import JOBTRACKER.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {

}
