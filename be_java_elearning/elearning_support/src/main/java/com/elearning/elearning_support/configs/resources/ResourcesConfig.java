package com.elearning.elearning_support.configs.resources;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class ResourcesConfig implements WebMvcConfigurer {

    private static final String[] CLASSPATH_RESOURCE_LOCATIONS =
        {
            "classpath:/META-INF/resources/",
            "classpath:/resources/",
            "classpath:/static/",
            "classpath:/public/",
            "classpath:/custom/"
        };

    @Value("${app.file-storage.resource-path}")
    private String filePathResource;

    @Value("${app.file-storage.location-path}")
    private String locationPathResource;

    @Value("${server.servlet.context-path}")
    private String context;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // config resourceHandlers and configure resourceLocation
        // fileResource : fileLocation + /**
        // fileLocation : ../resources/upload/files/
        registry.addResourceHandler(filePathResource).addResourceLocations(locationPathResource);
    }
}
