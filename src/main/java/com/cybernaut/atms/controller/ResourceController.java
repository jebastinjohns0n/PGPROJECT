package com.cybernaut.atms.controller;

import com.cybernaut.atms.model.Resource;
import com.cybernaut.atms.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<Resource>> getAllResources() {
        return ResponseEntity.ok(resourceService.getAllResources());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Resource> getResourceById(@PathVariable String id) {
        Optional<Resource> resource = resourceService.getResourceById(id);
        return resource.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Resource> createResource(
            @RequestPart("resource") Resource resource,
            @RequestPart("file") MultipartFile file) throws IOException {
        return ResponseEntity.status(HttpStatus.CREATED).body(resourceService.createResource(resource, file));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Resource> updateResource(@PathVariable String id, @RequestBody Resource resourceDetails) {
        Resource updatedResource = resourceService.updateResource(id, resourceDetails);
        if (updatedResource != null) {
            return ResponseEntity.ok(updatedResource);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable String id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/assignedTo/{userId}")
    public ResponseEntity<List<Resource>> getResourcesByAssignedTo(@PathVariable String userId) {
        return ResponseEntity.ok(resourceService.getResourcesByAssignedTo(userId));
    }

    @PostMapping("/clone")
    public ResponseEntity<Resource> cloneResource(@RequestBody Map<String, String> cloneDetails) {
        String originalId = cloneDetails.get("resourceId");
        String assignedTo = cloneDetails.get("assignedTo");
        String newTitle = cloneDetails.get("newTitle");
        
        Resource clonedResource = resourceService.cloneResource(originalId, assignedTo, newTitle);
        if (clonedResource != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(clonedResource);
        }
        return ResponseEntity.notFound().build();
    }
}

