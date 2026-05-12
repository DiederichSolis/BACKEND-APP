Create table Usuarios(
id_usuario BIGSERIAL primary key,
email varchar(100) unique not null,
nombre varchar(50) not null,
contraseña text not null,
activo boolean default true,
eliminado boolean default false,
fecha_creacion timestamp default NOW(),
fecha_modificacion timestamp,
fecha_eliminacion timestamp
);



Create table Tipo_tarjetas(
id_tipo_tarjeta BIGSERIAL primary key,
nombre varchar (50) not null,
activo  boolean default true,
eliminado boolean default false,
fecha_creacion timestamp default NOW(),
fecha_modificacion timestamp,
fecha_eliminacion timestamp
);


CREATE TABLE Tipo_Cuenta (
  id_tipo_cuenta BIGSERIAL primary key,
  nombre varchar (50) not null,
activo  boolean default true,
eliminado boolean default false,
fecha_creacion timestamp default NOW(),
fecha_modificacion timestamp,
fecha_eliminacion timestamp
);




CREATE TABLE Tipo_Transacciones (
  id_tipo_transaccion BIGSERIAL primary key,
  nombre varchar (50) not null,
activo  boolean default true,
eliminado boolean default false,
fecha_creacion timestamp default NOW(),
fecha_modificacion timestamp,
fecha_eliminacion timestamp
);


Create table Tarjetas(
id_tarjeta BIGSERIAL primary key,
id_usuario BIGINT not null,
id_tipo_tarjeta bigint not null,
numeracion varchar(50) not null,
expiracion date not null,
codigo int not null,
nombre varchar(50),
saldo numeric(10,2) default 0,

activo  boolean default true,
eliminado boolean default false,
fecha_creacion timestamp default NOW(),
fecha_modificacion timestamp,
fecha_eliminacion timestamp,

constraint fk_tarjeta_usuario 
foreign key (id_usuario)
references usuarios(id_usuario),

constraint fk_tarjeta_tipo 
foreign key (id_tipo_tarjeta)
references tipo_tarjetas(id_tipo_tarjeta)

);



create table Cuentas(
id_cuenta BIGserial primary key,
id_tipo_cuenta bigint not null,
id_usuario bigint not null,
no_cuenta varchar(100) not null,
saldo numeric(10,2) default 0,

activo  boolean default true,
eliminado boolean default false,
fecha_creacion timestamp default NOW(),
fecha_modificacion timestamp,
fecha_eliminacion timestamp,

constraint fk_cuenta_tipo
foreign key (id_tipo_cuenta)
references tipo_cuenta(id_tipo_cuenta),

constraint fk_cuenta_usuario
foreign key (id_usuario)
references usuarios(id_usuario)
);


create table Transacciones (
  id_transaccion bigserial primary key,
  id_tipo_transaccion bigint not null,
  id_usuario bigint not null,
  description varchar(100),
  monto numeric(10,2) not null,
  cuenta_a_transferir varchar(100),

  activo  boolean default true,
eliminado boolean default false,
fecha_creacion timestamp default NOW(),
fecha_modificacion timestamp,
fecha_eliminacion timestamp,

constraint fk_transaccion_tipo
foreign key (id_tipo_transaccion)
references tipo_transacciones(id_tipo_transaccion),

constraint fk_transaccion_usuario
foreign key (id_usuario)
references usuarios(id_usuario)

);



create table Movimientos(
id_movimiento bigserial primary key,
id_tarjeta bigint not null,
motivo varchar(100),
monto numeric(10,2) not null,

activo  boolean default true,
eliminado boolean default false,
fecha_creacion timestamp default NOW(),
fecha_modificacion timestamp,
fecha_eliminacion timestamp,

constraint fk_movimiento_tarjeta
foreign key (id_tarjeta)
references tarjetas(id_tarjeta)
  
);
