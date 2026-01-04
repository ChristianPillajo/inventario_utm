package com.example.inventariobackend.repository;

import com.example.inventariobackend.model.Movimiento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimientoRepository extends JpaRepository<Movimiento, Long> {
    List<Movimiento> findByProductoId(Long productoId);
    List<Movimiento> findByUsuarioId(Long usuarioId);
}
