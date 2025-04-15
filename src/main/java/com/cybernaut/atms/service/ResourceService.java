package com.cybernaut.atms.service;

import com.cybernaut.atms.model.Resource;
import com.cybernaut.atms.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository resourceRepository;

    public List<Resource> getAllResources() {
        return resourceRepository.findAll();
    }

    public Optional<Resource> getResourceById(String id) {
        return resourceRepository.findById(id);
    }

    public Resource createResource(Resource resource, MultipartFile file) throws IOException {
        if (file != null && !file.isEmpty()) {
            resource.setFileData(file.getBytes());
            resource.setSize(file.getSize());
            resource.setType(file.getContentType());
            resource.setUploadDate(LocalDate.now());
        }
        return resourceRepository.save(resource);
    }

    public Resource updateResource(String id, Resource resourceDetails) {
        Optional<Resource> resource = resourceRepository.findById(id);
        if (resource.isPresent()) {
            Resource existingResource = resource.get();
            existingResource.setTitle(resourceDetails.getTitle());
            existingResource.setDescription(resourceDetails.getDescription());
            existingResource.setAssignedTo(resourceDetails.getAssignedTo());
            return resourceRepository.save(existingResource);
        }
        return null;
    }

    public void deleteResource(String id) {
        resourceRepository.deleteById(id);
    }

    public List<Resource> getResourcesByAssignedTo(String assignedTo) {
        return resourceRepository.findByAssignedTo(assignedTo);
    }

    public Resource cloneResource(String originalId, String assignedTo, String newTitle) {
        Optional<Resource> originalResource = resourceRepository.findById(originalId);
        if (originalResource.isPresent()) {
            Resource original = originalResource.get();
            Resource clone = new Resource();
            clone.setTitle(newTitle != null && !newTitle.isEmpty() ? newTitle : original.getTitle() + " - Clone");
            clone.setDescription(original.getDescription());
            clone.setType(original.getType());
            clone.setSize(original.getSize());
            clone.setUploadedBy(original.getUploadedBy());
            clone.setUploadDate(LocalDate.now());
            clone.setCloned(true);
            clone.setOriginalId(originalId);
            clone.setAssignedTo(assignedTo);
            clone.setUrl(original.getUrl());
            clone.setFileData(original.getFileData());
            return resourceRepository.save(clone);
        }
        return null;
    }
}

