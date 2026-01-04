package com.example.inventariobackend.service;

import com.example.inventariobackend.dto.MovimientoDTO;
import com.example.inventariobackend.dto.MovimientoRequest;
import com.example.inventariobackend.model.Movimiento;
import com.example.inventariobackend.model.Producto;
import com.example.inventariobackend.model.Usuario;
import com.example.inventariobackend.repository.MovimientoRepository;
import com.example.inventariobackend.repository.ProductoRepository;
import com.example.inventariobackend.repository.UsuarioRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovimientoService {

    private final MovimientoRepository movimientoRepository;
    private final ProductoRepository productoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoService productoService;

    @Transactional
    public MovimientoDTO registrarMovimiento(MovimientoRequest request) {
        Producto producto = productoRepository.findById(request.getProductoId())
                .orElseThrow(() -> new EntityNotFoundException("Producto no encontrado"));

        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));

        // Validar stock para salidas
        if (Movimiento.TipoMovimiento.valueOf(request.getTipo()) == Movimiento.TipoMovimiento.SALIDA) {
            if (producto.getStockActual() < request.getCantidad()) {
                throw new RuntimeException("Stock insuficiente");
            }
        }

        // Crear movimiento
        Movimiento movimiento = new Movimiento();
        movimiento.setProducto(producto);
        movimiento.setTipo(Movimiento.TipoMovimiento.valueOf(request.getTipo()));
        movimiento.setCantidad(request.getCantidad());
        movimiento.setUsuario(usuario);
        movimiento.setObservacion(request.getObservacion());

        movimiento = movimientoRepository.save(movimiento);

        // Actualizar stock del producto
        int cantidadAjustada = Movimiento.TipoMovimiento.valueOf(request.getTipo()) == Movimiento.TipoMovimiento.ENTRADA
                ? request.getCantidad()
                : -request.getCantidad();

        productoService.actualizarStock(producto.getId(), cantidadAjustada);

        return convertirADTO(movimiento);
    }

    public List<MovimientoDTO> obtenerTodosMovimientos() {
        return movimientoRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public MovimientoDTO obtenerMovimientoPorId(Long id) {
        Movimiento movimiento = movimientoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Movimiento no encontrado"));
        return convertirADTO(movimiento);
    }

    public List<MovimientoDTO> obtenerMovimientosPorProducto(Long productoId) {
        return movimientoRepository.findByProductoId(productoId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public List<MovimientoDTO> obtenerMovimientosPorUsuario(Long usuarioId) {
        return movimientoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void eliminarMovimiento(Long id) {
        if (!movimientoRepository.existsById(id)) {
            throw new EntityNotFoundException("Movimiento no encontrado");
        }
        movimientoRepository.deleteById(id);
    }

    private MovimientoDTO convertirADTO(Movimiento movimiento) {
        MovimientoDTO dto = new MovimientoDTO();
        dto.setId(movimiento.getId());
        dto.setProductoId(movimiento.getProducto().getId());
        dto.setProductoNombre(movimiento.getProducto().getNombre());
        dto.setTipo(movimiento.getTipo().name());
        dto.setCantidad(movimiento.getCantidad());
        dto.setUsuarioId(movimiento.getUsuario().getId());
        dto.setUsuarioNombre(movimiento.getUsuario().getNombre());
        dto.setFechaMovimiento(movimiento.getFechaMovimiento());
        dto.setObservacion(movimiento.getObservacion());
        return dto;
    }
}
