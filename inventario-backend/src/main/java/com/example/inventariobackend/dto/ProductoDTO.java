package com.example.inventariobackend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ProductoDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Integer stockActual;
    private Long categoriaId;
    private String categoriaNombre;
    private LocalDateTime fechaCreacion;
}
