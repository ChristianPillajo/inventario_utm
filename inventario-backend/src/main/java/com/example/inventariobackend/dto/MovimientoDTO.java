package com.example.inventariobackend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MovimientoDTO {
    private Long id;
    private Long productoId;
    private String productoNombre;
    private String tipo;
    private Integer cantidad;
    private Long usuarioId;
    private String usuarioNombre;
    private LocalDateTime fechaMovimiento;
    private String observacion;
}
