import { useEffect, useState } from "react";
import Layout from "../shared/Layout";
import Input from "../shared/Input";

const Register = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    email: "",
    lastName: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
    image: "",
  });

  useEffect(() => {
    console.log("userData:", userData);
  }, [userData]);
  const HandleChange = (e) => {
    const { value, name, type, files } = e.target;
    setUserData((prv) => ({
      ...prv,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    console.log("data submitted", userData);
  };

  return (
    <Layout>
      <div className="bg-black text-white min-h-screen">
        <div className="w-1/2 flex justify-center items-center flex-col border-white  border-[4px] rounded-md mx-auto">
          <p className="text-white font-semibold text-lg text-center">
            Register
          </p>
          <div className="w-full  flex flex-col gap-4 p-3">
            <Input
              type="text"
              value={userData.firstName}
              placeholder={"First Name"}
              name={"firstName"}
              change={HandleChange}
            />
            <Input
              type="text"
              value={userData.lastName}
              placeholder={"Last Name"}
              name={"lastName"}
              change={HandleChange}
            />
            <Input
              type="text"
              value={userData.email}
              placeholder={"Email"}
              name={"email"}
              change={HandleChange}
            />
            <Input
              type="text"
              value={userData.address}
              placeholder={"Address"}
              name={"address"}
              change={HandleChange}
            />
            <Input
              type="password"
              value={userData.password}
              placeholder={"Password"}
              name={"password"}
              change={HandleChange}
            />
            <Input
              type="password"
              value={userData.confirmPassword}
              placeholder={"Confirm Password"}
              name={"confirmPassword"}
              change={HandleChange}
            />
          </div>

          <div className="w-full p-3">
            <span
              onClick={HandleSubmit}
              className="bg-white w-full inline-block text-black font-semibold px-4 py-2 rounded-md cursor-pointer text-center hover:bg-black hover:text-white border-[1px] border-white transition duration-500"
            >
              Submit
            </span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
