package com.example.inventariobackend.controller;


import com.example.inventariobackend.dto.MovimientoDTO;
import com.example.inventariobackend.dto.MovimientoRequest;
import com.example.inventariobackend.service.MovimientoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/movimientos")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MovimientoController {

    private final MovimientoService movimientoService;

    @PostMapping
    public ResponseEntity<MovimientoDTO> registrarMovimiento(@Valid @RequestBody MovimientoRequest request) {
        MovimientoDTO movimiento = movimientoService.registrarMovimiento(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(movimiento);
    }

    @GetMapping
    public ResponseEntity<List<MovimientoDTO>> obtenerTodosMovimientos() {
        List<MovimientoDTO> movimientos = movimientoService.obtenerTodosMovimientos();
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovimientoDTO> obtenerMovimientoPorId(@PathVariable Long id) {
        MovimientoDTO movimiento = movimientoService.obtenerMovimientoPorId(id);
        return ResponseEntity.ok(movimiento);
    }

    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<MovimientoDTO>> obtenerMovimientosPorProducto(@PathVariable Long productoId) {
        List<MovimientoDTO> movimientos = movimientoService.obtenerMovimientosPorProducto(productoId);
        return ResponseEntity.ok(movimientos);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<MovimientoDTO>> obtenerMovimientosPorUsuario(@PathVariable Long usuarioId) {
        List<MovimientoDTO> movimientos = movimientoService.obtenerMovimientosPorUsuario(usuarioId);
        return ResponseEntity.ok(movimientos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarMovimiento(@PathVariable Long id) {
        movimientoService.eliminarMovimiento(id);
        return ResponseEntity.noContent().build();
    }
}
