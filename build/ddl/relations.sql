-- relations.sql
alter table public.user drop constraint if exists fk_user_usertype;
alter table public.user add constraint fk_user_usertype foreign key (usertype_id) references public.usertype(usertype_id);

