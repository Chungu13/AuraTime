import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "sonner";
import { Trash2, Users, Briefcase, UserRound } from "lucide-react";

const ManageStaff = () => {
  const {
    frontstaff = [],
    professionalStaffs = [],
    getAllFrontStaff,
    getAllProfessionalStaff,
    deleteStaff,
    deleteProfessionalStaff,
    isLoading,
  } = useContext(AdminContext);

  useEffect(() => {
    if (!isLoading) {
      getAllFrontStaff();
      getAllProfessionalStaff();
    }
  }, [isLoading, getAllFrontStaff, getAllProfessionalStaff]);

  const handleDeleteStaff = async (id, type) => {
    try {
      if (type === "front") {
        await deleteStaff(id);
      } else {
        await deleteProfessionalStaff(id);
      }
    } catch (error) {
      toast.error("Failed to delete staff");
    }
  };


  const getInitials = (name = "") => {
    if (!name) return "";
    return (
      name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => (part[0] ? part[0].toUpperCase() : ""))
        .join("")
    );
  };

  const renderStaffList = (staffArray, type) => {
    const isFront = type === "front";
    const title = isFront ? "Business Owner & Front Desk Staff" : "Therapists";
    const emptyText = isFront ? "No staff available" : "No therapist available";

    return (
      <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50/80 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
              {isFront ? <Briefcase size={20} /> : <UserRound size={20} />}
            </div>

            <div>
              <h2 className="text-base font-semibold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500">
                {isFront
                  ? "Manage front desk and business staff records"
                  : "Manage therapist accounts and access"}
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-700">
            {staffArray.length} {staffArray.length === 1 ? "member" : "members"}
          </div>
        </div>

        {staffArray.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="min-w-[760px]">
              <div className="grid grid-cols-[80px_2fr_2fr_140px] border-b border-slate-200 bg-slate-50 px-6 py-3 text-sm font-semibold text-slate-600">
                <p>No.</p>
                <p>Name</p>
                <p>Email</p>
                <p className="text-right">Action</p>
              </div>

              {staffArray.map((staff, index) => (
                <div
                  key={staff._id}
                  className="grid grid-cols-[80px_2fr_2fr_140px] items-center px-6 py-4 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <p className="font-medium text-slate-500">{index + 1}</p>

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
                      {getInitials(staff.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium capitalize text-slate-900">
                        {staff.name}
                      </p>
                    </div>
                  </div>

                  <p className="truncate text-slate-600">{staff.email}</p>

                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this staff member?")) {
                          handleDeleteStaff(staff._id, type);
                        }
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-6 py-12 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <Users size={24} />
            </div>
            <p className="text-sm font-medium text-slate-700">{emptyText}</p>
            <p className="mt-1 text-sm text-slate-500">
              Staff records will appear here once they are added.
            </p>
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Administration</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
              Staff Management
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View and manage front desk staff and therapists from one place.
            </p>
          </div>

          <div className="inline-flex w-fit items-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            {isLoading
              ? "Fetching staff..."
              : `Total Staff: ${frontstaff.length + professionalStaffs.length}`}
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
            <p className="text-base font-medium text-slate-700">Loading staff list...</p>
            <p className="mt-1 text-sm text-slate-500">
              Please wait while staff records are being fetched.
            </p>
          </div>
        ) : (
          <>
            {renderStaffList(frontstaff, "front")}
            {renderStaffList(professionalStaffs, "professional")}
          </>
        )}
      </div>
    </div>
  );
};

export default ManageStaff;