import {
  ArrowUpIcon,
  QuestionMarkCircleIcon,
  TrashIcon,
  PencilIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import isEmpty from "lodash.isempty";
import Badge from "./components/common/Badge";
import Button from "./components/common/buttons/Button";
import Checkbox from "./components/common/Checkbox";
import UserInfo from "./components/UserInfo";
import { getTeamColor, getMembers, updateMember, deleteMember } from "./utils";
import { PAGE_LIMIT } from "./constants";
import classNames from "classnames";
import Modal from "./components/Modal";
import UserDetailsForm from "./components/UserDetailsForm";

const MODAL_TYPE = {
  EDIT: "EDIT",
  DELETE: "DELETE",
  DELETE_MULTIPLE: "DELETE_MULTIPLE",
  SUCCESS: "SUCCESS",
};

export default function App() {
  const [members, setMembers] = useState([]);
  const [membersCount, setMembersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(membersCount / PAGE_LIMIT);

  const [selectedMembers, setSelectedMembers] = useState({});
  const [memberDetails, setMemberDetails] = useState({});

  const [modalInfo, setModalInfo] = useState({ type: "", title: "" });

  useEffect(() => {
    fetchMembers();
  }, [page]);

  const fetchMembers = () => {
    setLoading(true);
    getMembers({ page, limit: PAGE_LIMIT })
      .then(({ items, count }) => {
        setError("");
        setMembers(items);
        setMembersCount(count);
      })
      .catch((err) => setError("Something went wrong"))
      .finally(() => {
        setLoading(false);
      });
  };

  const allMembersSelected = useMemo(
    () => !isEmpty(members) && members.every(({ id }) => selectedMembers[id]),
    [members, selectedMembers]
  );

  const anyMembersSelected = useMemo(() => {
    if (isEmpty(members)) return false;

    return Object.values(selectedMembers).some((selected) => selected);
  }, [members, selectedMembers]);

  const handleEdit = (member) => {
    setMemberDetails(members.find(({ id }) => member.id === id));
    setModalInfo({ type: MODAL_TYPE.EDIT, title: "Edit User Details" });
  };

  const handleDelete = (member) => {
    setMemberDetails(members.find(({ id }) => member.id === id));
    setModalInfo({
      type: MODAL_TYPE.DELETE,
      title: "Are you sure you want to delete this user?",
    });
  };

  const confirmDelete = () => {
    if (modalInfo.type === MODAL_TYPE.DELETE) {
      deleteMember(memberDetails)
        .then((res) => {
          setMembers(members.filter((member) => member.id !== res.id));
          setModalInfo({
            type: MODAL_TYPE.SUCCESS,
            title: "User successfully deleted!",
          });
          fetchMembers();
        })
        .catch((err) => setError("Something went wrong"));
    } else if (modalInfo.type === MODAL_TYPE.DELETE_MULTIPLE) {
      Promise.all(
        Object.entries(selectedMembers).map(([id, selected]) =>
          selected ? deleteMember({ id }) : null
        )
      )
        .then((res) => {
          fetchMembers();
          setModalInfo({
            type: MODAL_TYPE.SUCCESS,
            title: "Users successfully deleted!",
          });
        })
        .catch((err) => setError("Something went wrong"));
    }
  };

  const handleSave = (details) => {
    updateMember(details)
      .then((res) => {
        setMembers(
          members.map((member) => (member.id === res.id ? res : member))
        );
        setModalInfo({
          type: MODAL_TYPE.SUCCESS,
          title: "User Details changed!",
        });
      })
      .catch((err) => setError("Something went wrong"));
  };

  const handleChangePage = (page) => {
    if (page < 1 || page > pageCount) return;
    setPage(page);
  };

  const handleSelectMember = (member) => {
    const selected = !selectedMembers[member.id];
    setSelectedMembers({ ...selectedMembers, [member.id]: selected });
  };

  const handleSelectAll = () => {
    if (allMembersSelected) {
      setSelectedMembers({});
    } else {
      setSelectedMembers(
        members.reduce((map, { id }) => (map[id] = true) && map, {})
      );
    }
  };

  const closeModal = () => {
    setModalInfo({});
    setMemberDetails({});
  };

  return (
    <>
      <div className="flex m-3 justify-between align-middle space-x-1">
        <div>
          <span className="text-xl">Team Members</span>
          <Badge text={`${membersCount} Users`} color="purple" rounded />
        </div>

        <Button
          color="blue"
          disabled={!anyMembersSelected}
          onClick={() =>
            setModalInfo({
              type: MODAL_TYPE.DELETE_MULTIPLE,
              title: "Are you sure you want to delete selected user(s)?",
            })
          }
        >
          Delete Selected
        </Button>
      </div>

      <div className="flex flex-col">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 inline-block min-w-full sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <table className="min-w-full text-left text-gray-600">
                <thead className="border-b bg-gray-100 text-sm">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">
                      <Checkbox
                        label="Name"
                        checked={allMembersSelected}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th scope="col" className="text-sm px-6 py-4 font-medium">
                      Status
                      <ArrowUpIcon className="h-3 w-3 ml-1 inline-block stroke-2" />
                    </th>
                    <th scope="col" className="text-sm px-6 py-4 font-medium">
                      Role
                      <QuestionMarkCircleIcon className="h-4 w-4 ml-1 inline-block stroke-2" />
                    </th>
                    <th scope="col" className="text-sm px-6 py-4 font-medium">
                      Email Address
                    </th>
                    <th scope="col" className="text-sm px-6 py-4 font-medium">
                      Teams
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <MessageRow
                    loading={loading}
                    error={error}
                    membersCount={membersCount}
                  />
                  {!loading &&
                    members.map((member) => (
                      <TableRow
                        key={member.id}
                        member={member}
                        selectedMembers={selectedMembers}
                        onSelectMember={handleSelectMember}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ))}
                  {!isEmpty(members) && (
                    <Paginator
                      page={page}
                      membersCount={membersCount}
                      onChangePage={handleChangePage}
                      pageCount={pageCount}
                    />
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalInfo.type === MODAL_TYPE.EDIT}
        closeModal={closeModal}
        title={modalInfo.title}
      >
        <UserDetailsForm
          details={memberDetails}
          onSave={handleSave}
          onCancel={closeModal}
        />
      </Modal>

      <Modal
        isOpen={[MODAL_TYPE.DELETE, MODAL_TYPE.DELETE_MULTIPLE].includes(
          modalInfo.type
        )}
        closeModal={closeModal}
        title={modalInfo.title}
      >
        <div className="flex flex-row">
          <Button
            outline
            color="gray"
            className="w-1/2 ml-0"
            onClick={closeModal}
          >
            Cancel
          </Button>
          <Button color="purple" className="w-1/2 mr-0" onClick={confirmDelete}>
            Confirm
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={modalInfo.type === MODAL_TYPE.SUCCESS}
        closeModal={closeModal}
        title={
          <div className="flex flex-col ">
            <CheckCircleIcon className="h-10 w-10 my-3 text-green-500 inline-block stroke-2" />
            {modalInfo.title}
            <Button
              color="purple"
              onClick={closeModal}
              className="mx-auto mt-5 w-1/2"
            >
              Ok
            </Button>
          </div>
        }
      />
    </>
  );
}

const TableRow = ({
  member,
  onEdit,
  onDelete,
  selectedMembers,
  onSelectMember,
}) => {
  const { id, name, userName, email, avatar, isActive, role, teams } = member;

  return (
    <tr className="bg-white border-b">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <Checkbox
          label={<UserInfo imgUrl={avatar} name={name} userName={userName} />}
          checked={!!selectedMembers[id]}
          onChange={() => onSelectMember(member)}
        />
      </td>
      <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
        <Badge
          text={isActive ? "● Active" : "Inactive"}
          color={isActive ? "green" : "red"}
          rounded
        />
      </td>
      <td className="text-sm font-light px-6 py-4">{role}</td>
      <td className="text-sm font-light px-6 py-4 whitespace-nowra">{email}</td>
      <td className="text-sm font-light px-6 py-4">
        <div className="flex flex-row justify-between">
          <div>
            {teams.slice(0, 4).map((team, i) => (
              <Badge key={team} text={team} color={getTeamColor(i)} rounded />
            ))}
            {teams.length > 4 && (
              <Badge text={`+${teams.length - 4}`} color="gray" rounded />
            )}
          </div>
          <div>
            <TrashIcon
              className="h-5 w-5 ml-1 inline-block stroke-2 cursor-pointer text-gray-500"
              onClick={() => onDelete(member)}
            />
            <PencilIcon
              className="h-5 w-5 ml-1 inline-block stroke-2 cursor-pointer text-gray-500"
              onClick={() => onEdit(member)}
            />
          </div>
        </div>
      </td>
    </tr>
  );
};

const MessageRow = ({ loading, error, membersCount }) => {
  return (
    <tr className="">
      <td className="p-2 text-lg text-center" colSpan={5}>
        {loading && "Loading..."}
        {!loading && error && "Something went wrong! Please try again"}

        {!loading && !membersCount && "No members"}
      </td>
    </tr>
  );
};

const Paginator = ({ page = 1, pageCount = 1, onChangePage }) => {
  const [windowStart, setWindowStart] = useState(1);

  const allowWindowPrev = windowStart > 1;
  const allowWindowNext = windowStart + 5 < pageCount;

  return (
    <tr className="bg-white border-b">
      <td colSpan={5}>
        <div className="flex justify-between">
          <Button
            outline
            color="gray"
            disabled={page === 1}
            onClick={() => onChangePage(page - 1)}
          >
            <div className="flex flex-row justify-around">
              <ArrowLeftIcon className="h-4 w-5 my-auto mr-2 inline-block stroke-2 text-gray-500" />{" "}
              <span className="my-auto">Previous</span>
            </div>
          </Button>

          <div className="flex justify-center my-auto">
            <nav aria-label="Page navigation example">
              <ul className="flex list-style-none">
                <li>
                  <div
                    className={`cursor-pointer relative py-2 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-${
                      allowWindowPrev ? 800 : 400
                    } ${
                      allowWindowPrev
                        ? "hover:text-gray-800 hover:bg-gray-200"
                        : ""
                    } focus:shadow-none`}
                    onClick={() =>
                      allowWindowPrev && setWindowStart(windowStart - 1)
                    }
                  >
                    <ArrowLeftCircleIcon className="my-auto h-5 w-5 stroke-2" />
                  </div>
                </li>

                {new Array(Math.min(6, pageCount)).fill(null).map((_, i) => {
                  const isSeleted = windowStart + i === page;
                  return (
                    <li key={i}>
                      <div
                        className={classNames(
                          "mx-1 cursor-pointer relative block py-1.5 px-3 border-0 outline-none transition-all duration-300 rounded focus:shadow-none",
                          {
                            "text-gray-800 hover:text-gray-800 hover:bg-gray-200 bg-transparent":
                              !isSeleted,
                            " bg-purple-100 text-purple-600": isSeleted,
                          }
                        )}
                        onClick={() => onChangePage(windowStart + i)}
                      >
                        {windowStart + i}
                      </div>
                    </li>
                  );
                })}

                <li>
                  <div
                    className={`cursor-pointer relative py-2 px-3 border-0 bg-transparent outline-none transition-all duration-300 rounded text-gray-${
                      allowWindowNext ? 800 : 400
                    } ${
                      allowWindowNext
                        ? "hover:text-gray-800 hover:bg-gray-200"
                        : ""
                    } focus:shadow-none`}
                  >
                    <ArrowRightCircleIcon
                      className="my-auto h-5 w-5 stroke-2"
                      onClick={() =>
                        allowWindowNext && setWindowStart(windowStart + 1)
                      }
                    />
                  </div>
                </li>
              </ul>
            </nav>
          </div>

          <Button
            outline
            color="gray"
            disabled={page === pageCount}
            onClick={() => onChangePage(page + 1)}
          >
            <div className="flex flex-row justify-around">
              <span className="my-auto">Next</span>
              <ArrowRightIcon className="h-4 w-5 my-auto ml-2 inline-block stroke-2 text-gray-500" />{" "}
            </div>
          </Button>
        </div>
      </td>
    </tr>
  );
};
