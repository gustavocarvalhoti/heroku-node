drop schema casadocodigo_nodejs;
create schema casadocodigo_nodejs;
use casadocodigo_nodejs;

create table produto (
  id        int(11) not null auto_increment primary key,
  titulo    varchar(255)     default null,
  descricao text,
  preco     decimal(10, 2)   default null
);

insert into produto (titulo, descricao, preco)
values ('comecando com nodejs', 'livro introdutório sobre nodejs', 19.90),
('comecando com javascript', 'livro introdutório sobre javascript', 29.90),
('comecando com express', 'livro introdutório sobre express', 39.99);

drop schema casadocodigo_nodejs_test;
create schema casadocodigo_nodejs_test;
use casadocodigo_nodejs_test;

create table produto (
  id        int(11) not null auto_increment primary key,
  titulo    varchar(255)     default null,
  descricao text,
  preco     decimal(10, 2)   default null
);

insert into produto (titulo, descricao, preco)
values ('comecando com nodejs', 'livro introdutório sobre nodejs', 9.90),
('comecando com javascript', 'livro introdutório sobre javascript', 19.90),
('comecando com express', 'livro introdutório sobre express', 29.99),
('java basico', 'livro introdutório sobre java', 29.99);
