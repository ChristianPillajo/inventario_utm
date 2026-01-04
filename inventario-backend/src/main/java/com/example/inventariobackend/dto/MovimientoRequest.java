package com.example.inventariobackend.dto;

import lombok.Data;

@Data
public class MovimientoRequest {
    private Long productoId;
    private String tipo;
    private Integer cantidad;
    private Long usuarioId;
    private String observacion;
}
