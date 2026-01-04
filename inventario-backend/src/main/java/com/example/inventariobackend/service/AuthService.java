package com.example.inventariobackend.service;

import com.example.inventariobackend.dto.LoginRequest;
import com.example.inventariobackend.dto.UsuarioDTO;
import com.example.inventariobackend.model.Usuario;
import com.example.inventariobackend.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDTO login(LoginRequest request) {

        Usuario usuario = usuarioRepository.findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Usuario no existe"));

        // Comparación directa (texto plano)
        if (!request.getPassword().equals(usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }

        UsuarioDTO dto = new UsuarioDTO();
        dto.setId(usuario.getId());
        dto.setNombre(usuario.getNombre());
        dto.setEmail(usuario.getEmail());
        dto.setRol(String.valueOf(usuario.getRol()));

        return dto;
    }
}


