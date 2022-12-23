import React, { Fragment, useState, useEffect } from "react";
import cloneDeep from "lodash.clonedeep";
import isEmpty from "lodash.isempty";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";
import { Transition, Listbox } from "@headlessui/react";

import Button from "./common/buttons/Button";
import { ROLES } from "../constants";

const UserDetailsForm = ({
  details: initialDetails = {},
  onSave,
  onCancel,
}) => {
  const [details, setDetails] = useState({});

  useEffect(() => {
    if (!isEmpty(initialDetails)) {
      setDetails(cloneDeep(initialDetails));
    }
  }, [initialDetails]);

  const handleChange = (field, value) => {
    setDetails({ ...details, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div>
        <label
          htmlFor="name"
          className="m-1 block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="name"
          placeholder="Name"
          value={details.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div>
        <label
          htmlFor="name"
          className="m-1 block text-sm font-medium text-gray-700"
        >
          Role
        </label>

        <Dropdown
          options={ROLES}
          value={ROLES.find(({ name }) => details.role === name) || ROLES[0]}
          onChange={(value) => handleChange("role", value.name)}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="m-1 block text-sm font-medium text-gray-700"
        >
          Email address
        </label>
        <input
          className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded-lg transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
          id="email"
          placeholder="Email Address"
          value={details.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </div>
      <div className="flex flex-row">
        <Button outline color="gray" className="w-1/2 ml-0" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          color="purple"
          className="w-1/2 mr-0"
          onClick={() => onSave(details)}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
};

const Dropdown = ({ options, value, onChange }) => {
  return (
    <Listbox value={value} onChange={onChange}>
      <div className="relative mt-1">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm border border-solid border-gray-300">
          <span className="block truncate">{value.name}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-1 w-full  rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {options.map((role) => (
              <Listbox.Option
                key={role.name}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-4 ${
                    active ? "bg-purple-100 text-purple-900" : "text-gray-900"
                  }`
                }
                value={role}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {role.name}
                    </span>
                    {selected && (
                      <span className="absolute inset-y-0 right-2 flex items-center pl-3 text-purple-600">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
export default UserDetailsForm;
