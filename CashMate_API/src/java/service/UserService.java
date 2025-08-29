package service;

import com.google.gson.JsonObject;
import entity.UserEntity;
import hibernate.HibernateUtil;
import java.util.Date;
import model.Util;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.criterion.Restrictions;

public class UserService {

    public JsonObject createUser(JsonObject requestObject) {

        JsonObject responseObject = new JsonObject();
        responseObject.addProperty("status", Boolean.FALSE);

        String first_name = requestObject.get("first_name").getAsString();
        String last_name = requestObject.get("last_name").getAsString();
        String user_name = requestObject.get("user_name").getAsString();
        String password = requestObject.get("password").getAsString();

        if (first_name.isEmpty()) {
            responseObject.addProperty("message", "First name is required");
        } else if (last_name.isEmpty()) {
            responseObject.addProperty("message", "Last name is required");
        } else if (user_name.isEmpty()) {
            responseObject.addProperty("message", "User name is required");
        } else if (password.isEmpty()) {
            responseObject.addProperty("message", "Password is required");
        } else if (!Util.isPasswordValid(password)) {
            responseObject.addProperty("message", "Password must be at least 8 characters long and "
                    + "include at least one uppercase letter, one lowercase letter, "
                    + "one number, and one special character.");
        } else {

            Session hibernateSession = HibernateUtil.getSessionFactory().openSession();
            Transaction transaction = hibernateSession.beginTransaction();

            try {
                Criteria c1 = hibernateSession.createCriteria(UserEntity.class)
                        .add(Restrictions.eq("user_name", user_name));

                if (!c1.list().isEmpty()) {
                    responseObject.addProperty("message", "Entered user name already exists. "
                            + "Please try with different user name");
                } else {

                    UserEntity user = new UserEntity();
                    user.setFirst_name(first_name);
                    user.setLast_name(last_name);
                    user.setUser_name(user_name);
                    user.setPassword(password);
                    user.setCreated_at(new Date());

                    hibernateSession.save(user);
                    transaction.commit();

                    responseObject.addProperty("message", "Successfully created new user account");
                    responseObject.addProperty("status", Boolean.TRUE);

                }
            } catch (Exception e) {
                responseObject.addProperty("message", "Something went wrong. Please try again");
                transaction.rollback();
            } finally {
                hibernateSession.close();
            }

        }

        return responseObject;

    }

}
