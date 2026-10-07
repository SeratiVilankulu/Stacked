import UserLayout from "../../components/UserLayout.jsx";
import BookCarousel from "../../components/BookCarousel.jsx";

function Dashboard() {
  return (
    <UserLayout>
      {/* Dashboard content */}
      <div className="px-5 pb-12 sm:px-8 lg:px-10">
        <section>
          <BookCarousel />
        </section>
      </div>
    </UserLayout>
  );
}

export default Dashboard;
