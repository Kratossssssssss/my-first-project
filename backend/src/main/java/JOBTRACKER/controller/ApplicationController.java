package JOBTRACKER.controller;

import jakarta.validation.Valid;
import JOBTRACKER.Application;
import JOBTRACKER.service.ApplicationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public List<Application> getAllApplications() {
        return applicationService.getAllApplications();
    }
    @PostMapping
    public Application createApplication(@Valid @RequestBody Application application) {
        return applicationService.createApplication(application);
    }
    @PutMapping("/{id}")
    public Application updateApplication(
            @PathVariable Integer id,
            @RequestBody Application application) {

        return applicationService.updateApplication(id, application);
    }

    @DeleteMapping("/{id}")
    public String deleteApplication(@PathVariable Integer id) {
        applicationService.deleteApplication(id);
        return "Application deleted successfully";
    }
}
