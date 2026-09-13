-- Apply ON DELETE policy to foreign keys.
-- Prisma 8 records onDelete in the contract but db update does not apply it.
BEGIN;
ALTER TABLE public."admin" DROP CONSTRAINT "admin_user_id_fkey";
ALTER TABLE public."admin" ADD CONSTRAINT "admin_user_id_fkey" FOREIGN KEY ("User_Id") REFERENCES public."users"("Id") ON DELETE RESTRICT;
ALTER TABLE public."admin" DROP CONSTRAINT "admin_book_id_fkey";
ALTER TABLE public."admin" ADD CONSTRAINT "admin_book_id_fkey" FOREIGN KEY ("Book_Id") REFERENCES public."books"("Id") ON DELETE RESTRICT;
ALTER TABLE public."bookcopies" DROP CONSTRAINT "bookcopy_book_id_fkey";
ALTER TABLE public."bookcopies" ADD CONSTRAINT "bookcopy_book_id_fkey" FOREIGN KEY ("Book_Id") REFERENCES public."books"("Id") ON DELETE CASCADE;
ALTER TABLE public."bookcopies" DROP CONSTRAINT "bookcopy_user_id_fkey";
ALTER TABLE public."bookcopies" ADD CONSTRAINT "bookcopy_user_id_fkey" FOREIGN KEY ("User_Id") REFERENCES public."users"("Id") ON DELETE RESTRICT;
ALTER TABLE public."fines" DROP CONSTRAINT "fines_loan_id_fkey";
ALTER TABLE public."fines" ADD CONSTRAINT "fines_loan_id_fkey" FOREIGN KEY ("Loan_Id") REFERENCES public."loanedbooks"("Id") ON DELETE CASCADE;
ALTER TABLE public."fines" DROP CONSTRAINT "fines_user_id_fkey";
ALTER TABLE public."fines" ADD CONSTRAINT "fines_user_id_fkey" FOREIGN KEY ("User_Id") REFERENCES public."users"("Id") ON DELETE RESTRICT;
ALTER TABLE public."loanedbooks" DROP CONSTRAINT "loanedbooks_book_id_fkey";
ALTER TABLE public."loanedbooks" ADD CONSTRAINT "loanedbooks_book_id_fkey" FOREIGN KEY ("Book_id") REFERENCES public."books"("Id") ON DELETE RESTRICT;
ALTER TABLE public."loanedbooks" DROP CONSTRAINT "loanedbooks_user_id_fkey";
ALTER TABLE public."loanedbooks" ADD CONSTRAINT "loanedbooks_user_id_fkey" FOREIGN KEY ("User_id") REFERENCES public."users"("Id") ON DELETE RESTRICT;
ALTER TABLE public."reservations" DROP CONSTRAINT "reservation_user_id_fkey";
ALTER TABLE public."reservations" ADD CONSTRAINT "reservation_user_id_fkey" FOREIGN KEY ("User_Id") REFERENCES public."users"("Id") ON DELETE CASCADE;
ALTER TABLE public."reservations" DROP CONSTRAINT "reservation_book_id_fkey";
ALTER TABLE public."reservations" ADD CONSTRAINT "reservation_book_id_fkey" FOREIGN KEY ("Book_Id") REFERENCES public."books"("Id") ON DELETE CASCADE;
COMMIT;
