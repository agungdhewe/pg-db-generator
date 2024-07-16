-- user.sql
-- created: Tue Jul 16 2024 08:20:50 GMT+0700 (Western Indonesia Time)
-- last modified: Sun Jul 14 2024 21:44:39 GMT+0700 (Western Indonesia Time)
-- generated at: 2024-07-16T08:38:01.322+07:00
create table if not exists public.user (
	user_id bigserial not null ,
	primary key(user_id)
);
comment on table public.user is 'daftar user';

-- add columns
alter table public.user
	add column if not exists email varchar(90) not null ,
	add column if not exists password varchar(255) not null ,
	add column if not exists fullname varchar(90) not null ,
	add column if not exists isdisabled boolean not null default false,
	add column if not exists usertype_id varchar(7) not null ,
	add column if not exists createby varchar(64) not null ,
	add column if not exists createdate timestamp not null default now(),
	add column if not exists modifyby varchar(64) not null ,
	add column if not exists modifydate timestamp not null 
;

-- modify columns
alter table public.user
	alter column email type varchar(90),
	alter column email set not null,
	alter column email drop default,
	alter column password type varchar(255),
	alter column password set not null,
	alter column password drop default,
	alter column fullname type varchar(90),
	alter column fullname set not null,
	alter column fullname drop default,
	alter column isdisabled type boolean,
	alter column isdisabled set not null,
	alter column isdisabled set default false,
	alter column usertype_id type varchar(7),
	alter column usertype_id set not null,
	alter column usertype_id drop default,
	alter column createby type varchar(64),
	alter column createby set not null,
	alter column createby drop default,
	alter column createdate type timestamp,
	alter column createdate set not null,
	alter column createdate set default now(),
	alter column modifyby type varchar(64),
	alter column modifyby set not null,
	alter column modifyby drop default,
	alter column modifydate type timestamp,
	alter column modifydate set not null,
	alter column modifydate drop default
;

alter table public.user drop constraint if exists unq_user_email;
alter table public.user add constraint unq_user_email unique (email);
