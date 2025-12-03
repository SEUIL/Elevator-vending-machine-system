package com.elevatorVendingMachineSystem.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@Service
public class FileService {

    // 이미지가 저장될 실제 경로 (C 드라이브 예시)
    // 맥/리눅스라면 "/Users/사용자명/uploads/" 등으로 변경 필요
    private final String uploadDir = "C:/elevator-vending-uploads/";

    public String saveFile(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return null;
        }

        // 폴더가 없으면 생성
        File folder = new File(uploadDir);
        if (!folder.exists()) {
            folder.mkdirs();
        }

        // 파일명 중복 방지를 위해 UUID 사용 (예: "uuid_원래이름.jpg")
        String originalFileName = file.getOriginalFilename();
        String uuid = UUID.randomUUID().toString();
        String savedFileName = uuid + "_" + originalFileName;

        // 실제 파일 저장
        File destination = new File(uploadDir + savedFileName);
        file.transferTo(destination);

        // DB에 저장할 접근 경로 반환 (예: "/images/uuid_filename.jpg")
        return "/images/" + savedFileName;
    }
}