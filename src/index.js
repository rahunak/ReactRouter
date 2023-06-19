import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createHashRouter, RouterProvider,createBrowserRouter } from "react-router-dom";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import ErrorPage from "./error-page";
import Contact, {
  loader as contactLoader,
  action as contactAction,
} from "./routes/contact";
import EditContact, { action as editAction } from "./routes/edit";
import { action as destroyContact } from "./routes/destroy";
import Index from "./routes/index";
import Fun from "./routes/fun";
//Не забывай это всего лишь настройка роутинга (конфигурация роутинга)
// для Git Pages мы используем вместо createBrowserRouter => createHashRouter
const router = createHashRouter([
  // а так же все пути можно было бы переписать используя createRoutesFromElements
  // https://reactrouter.com/en/main/start/tutorial#jsx-routes
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader, //загружаем ф-ю loader из <Root />, это тот же getContacts() из contacts.js
    action: rootAction, // тот же createContact() из contacts.js
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          //все дети с их путями должны распологаться здесь как обьекты
          {
            index: true, // Отображение Компоненты по умолчанию.(когда нет childs в url) instead of { path: "" }
            element: <Index />,
          },
          {
            //функционал связан с <Outlet /> in <Root />
            // т.е. отображается страница <Root> но дети из Root отображаются в <Outlet />
            path: "contacts/:contactId",
            element: <Contact />,
            loader: contactLoader, //используем данную ф-ю loader загруженную в <Contact />, которую мы загрузили туда из contacts.js
            //по простому это вызов ф-и getContact(здесь id обьекта, а так же это url)
            action: contactAction, // экшн для изменения Faivorive(звездочка) (вызываем ф-ю updateContact)
            // через <fetcher.Form method="post"> и fetcher = useFetcher(); мы не меняем url, и взаимодействуем с данными, меняя их
          },
          {
            path: "contacts/:contactId/edit",
            element: <EditContact />,
            loader: contactLoader,
            action: editAction,
          },
          {
            // Реакция на нажатие кнопки Delete,
            // Подключаем действие формы при самбмите,(как бы происходит редирект по адресу пути, но всего лишь выполняется ф-я)
            path: "contacts/:contactId/destroy_contact",
            action: destroyContact,
            errorElement: <div>Oops! There was an error.</div>, // Можно добавлять для каждой ошибки свои страницы с отображением ошибки
          },
        ],
      },
    ],
  },
  {
    //отдельная страничка, не принадлежащая корневой странице
    path: "secret",
    element: <Fun />,
  },
    {
    //отдельная страничка, не принадлежащая корневой странице
    path: "ReactRouter",
    element: <Fun />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
