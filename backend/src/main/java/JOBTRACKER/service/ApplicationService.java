package JOBTRACKER.service;

import JOBTRACKER.Application;
import JOBTRACKER.repository.ApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationService(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }
    public Application createApplication(Application application) {
        return applicationRepository.save(application);
    }
    public Application updateApplication(Integer id, Application application) {
        Application existing = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        existing.setUserId(application.getUserId());
        existing.setCompany(application.getCompany());
        existing.setJobTitle(application.getJobTitle());
        existing.setLocation(application.getLocation());
        existing.setJobType(application.getJobType());
        existing.setApplicationDate(application.getApplicationDate());
        existing.setStatus(application.getStatus());
        existing.setJobUrl(application.getJobUrl());
        existing.setSalary(application.getSalary());
        existing.setNotes(application.getNotes());

        return applicationRepository.save(existing);
    }

    public void deleteApplication(Integer id) {
        applicationRepository.deleteById(id);
    }
}
