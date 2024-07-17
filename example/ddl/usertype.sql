-- usertype.sql
-- created: Tue Jul 16 2024 08:43:14 GMT+0700 (Western Indonesia Time)
-- last modified: Tue Jul 16 2024 08:43:14 GMT+0700 (Western Indonesia Time)
-- generated at: 2024-07-16T09:27:24.277+07:00
create table if not exists public.usertype (
	usertype_id varchar(7) not null ,
	primary key(usertype_id)
);
comment on table public.usertype is 'daftar user type';

-- add columns
alter table public.usertype
	add column if not exists name varchar(32) not null ,
	add column if not exists descr varchar(255)  ,
	add column if not exists createby varchar(64)  ,
	add column if not exists createdate timestamp not null default now(),
	add column if not exists modifyby varchar(64)  ,
	add column if not exists modifydate timestamp  
;

-- modify columns
alter table public.usertype
	alter column name type varchar(32),
	alter column name set not null,
	alter column name drop default,
	alter column descr type varchar(255),
	alter column descr drop not null,
	alter column descr drop default,
	alter column createby type varchar(64),
	alter column createby drop not null,
	alter column createby drop default,
	alter column createdate type timestamp,
	alter column createdate set not null,
	alter column createdate set default now(),
	alter column modifyby type varchar(64),
	alter column modifyby drop not null,
	alter column modifyby drop default,
	alter column modifydate type timestamp,
	alter column modifydate drop not null,
	alter column modifydate drop default
;

alter table public.usertype drop constraint if exists unq_usertype_name;
alter table public.usertype add constraint unq_usertype_name unique (name);
