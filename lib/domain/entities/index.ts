/**
 * Domain Layer - Entidades de Negocio
 * Representa las reglas de negocio más importantes
 */

// Value Objects
export class Email {
  private constructor(private readonly value: string) {}
  
  static create(email: string): Email {
    if (!this.isValid(email)) {
      throw new Error('Email inválido');
    }
    return new Email(email.toLowerCase().trim());
  }
  
  private static isValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  getValue(): string {
    return this.value;
  }
  
  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

export class MembershipAmount {
  private static readonly MEMBERSHIP_PRICE = 18;
  
  private constructor(private readonly value: number) {}
  
  static create(): MembershipAmount {
    return new MembershipAmount(this.MEMBERSHIP_PRICE);
  }
  
  getValue(): number {
    return this.value;
  }
  
  equals(other: MembershipAmount): boolean {
    return this.value === other.value;
  }
}

export class UserId {
  private constructor(private readonly value: number) {}
  
  static create(id: number): UserId {
    if (id <= 0) {
      throw new Error('ID de usuario debe ser positivo');
    }
    return new UserId(id);
  }
  
  getValue(): number {
    return this.value;
  }
  
  equals(other: UserId): boolean {
    return this.value === other.value;
  }
}

// Entidad de Dominio
export class User {
  private constructor(
    private readonly id: UserId | null,
    private readonly nombre: string,
    private readonly apellido: string,
    private readonly email: Email,
    private readonly telefono: string,
    private readonly codigoPais: string,
    private readonly passwordHash: string,
    private readonly createdAt: Date
  ) {}
  
  static create(params: {
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    codigoPais: string;
    passwordHash: string;
  }): User {
    // Validaciones de dominio
    if (params.nombre.length < 2 || params.nombre.length > 50) {
      throw new Error('Nombre debe tener entre 2 y 50 caracteres');
    }
    
    if (params.apellido.length < 2 || params.apellido.length > 50) {
      throw new Error('Apellido debe tener entre 2 y 50 caracteres');
    }
    
    if (params.telefono.length < 5 || params.telefono.length > 20) {
      throw new Error('Teléfono debe tener entre 5 y 20 caracteres');
    }
    
    return new User(
      null, // ID será asignado por la DB
      params.nombre.trim(),
      params.apellido.trim(),
      Email.create(params.email),
      params.telefono.trim(),
      params.codigoPais,
      params.passwordHash,
      new Date()
    );
  }
  
  static fromPersistence(params: {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    codigoPais: string;
    passwordHash: string;
    createdAt: Date;
  }): User {
    return new User(
      UserId.create(params.id),
      params.nombre,
      params.apellido,
      Email.create(params.email),
      params.telefono,
      params.codigoPais,
      params.passwordHash,
      params.createdAt
    );
  }
  
  // Getters
  getId(): UserId | null { return this.id; }
  getNombre(): string { return this.nombre; }
  getApellido(): string { return this.apellido; }
  getEmail(): Email { return this.email; }
  getTelefono(): string { return this.telefono; }
  getCodigoPais(): string { return this.codigoPais; }
  getPasswordHash(): string { return this.passwordHash; }
  getCreatedAt(): Date { return this.createdAt; }
  
  // Método de dominio
  getFullName(): string {
    return `${this.nombre} ${this.apellido}`;
  }
  
  // Para persistencia
  toPersistence() {
    return {
      nombre: this.nombre,
      apellido: this.apellido,
      email: this.email.getValue(),
      telefono: this.telefono,
      codigoPais: this.codigoPais,
      passwordHash: this.passwordHash,
      createdAt: this.createdAt
    };
  }
}

// Entidad de Pago
export class MembershipPayment {
  private constructor(
    private readonly id: string | null,
    private readonly userId: UserId,
    private readonly amount: MembershipAmount,
    private readonly metodoPago: string,
    private readonly status: 'pending' | 'completed' | 'failed',
    private readonly createdAt: Date
  ) {}
  
  static create(params: {
    userId: UserId;
    metodoPago: string;
  }): MembershipPayment {
    const validMethods = ['mercadopago', 'paypal'];
    if (!validMethods.includes(params.metodoPago)) {
      throw new Error('Método de pago no válido');
    }
    
    return new MembershipPayment(
      null,
      params.userId,
      MembershipAmount.create(),
      params.metodoPago,
      'pending',
      new Date()
    );
  }
  
  // Getters
  getId(): string | null { return this.id; }
  getUserId(): UserId { return this.userId; }
  getAmount(): MembershipAmount { return this.amount; }
  getMetodoPago(): string { return this.metodoPago; }
  getStatus(): string { return this.status; }
  getCreatedAt(): Date { return this.createdAt; }
  
  // Métodos de dominio
  markAsCompleted(): MembershipPayment {
    return new MembershipPayment(
      this.id,
      this.userId,
      this.amount,
      this.metodoPago,
      'completed',
      this.createdAt
    );
  }
  
  // Para restaurar desde persistencia
  static restore(data: {
    id: number;
    userId: number;
    amount: number;
    metodoPago: string;
    status: string;
    createdAt: Date;
  }): MembershipPayment {
    return new MembershipPayment(
      String(data.id),
      UserId.create(data.userId),
      { getValue: () => data.amount } as MembershipAmount, // Simplificado para el restore
      data.metodoPago,
      data.status as 'pending' | 'completed' | 'failed',
      data.createdAt
    );
  }
  
  // Para persistencia
  toPersistence() {
    return {
      userId: this.userId.getValue(),
      amount: this.amount.getValue(),
      metodoPago: this.metodoPago,
      status: this.status,
      createdAt: this.createdAt
    };
  }
}
