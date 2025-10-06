import { Test, TestingModule } from '@nestjs/testing';
import { DetalleBoletasService } from './detalle_boletas.service';

describe('DetalleBoletasService', () => {
  let service: DetalleBoletasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleBoletasService],
    }).compile();

    service = module.get<DetalleBoletasService>(DetalleBoletasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
