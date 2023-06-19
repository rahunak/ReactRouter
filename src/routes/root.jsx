import { Outlet, Link, useLoaderData, Form, redirect, NavLink, useNavigation, useSubmit } from "react-router-dom";
import { getContacts, createContact } from "../contacts";
import { useEffect } from "react";
//Было, я не разобрался почему именно так было
// export async function loader() {
//   const contacts = await getContacts();
//   return { contacts };
// }
export async function loader({ request }) {
  // Алгоритм работы такой:
  // Срабатывает Get запрос, создается как бы новый url, из него забирается поисковой параметр(строка которую ищем) и дальше getContacts(searchRequest);
  const url = new URL(request.url);
  const searchRequest = url.searchParams.get("searchRequest");
  const contacts = await getContacts(searchRequest);
  return { contacts, searchRequest };
}
export async function action() {
  //Нажатие на кнопу New для создания новой записи
  const contact = await createContact();
    return redirect(`/contacts/${contact.id}/edit`);
  // return { contact }; //Если убрать строку выше и заменить ее этой строкой, то в боковой панели просто будут появляться новые записи  без данных,
  // а так происходит редирект на Компоненту <Edit />для создания новой записи.
}
export default function Root() {
  const { contacts, searchRequest } = useLoaderData(); // интересный хук, я так понимаю для загрузки данных из компоненты что вызвала ф-ю loader
  const navigation = useNavigation();//Хук  useNavigation returns the current navigation state: it can be one of "idle" | "submitting" | "loading".
  // Мы его используем для навешивания класса "loading" на блок с id="detail"
  
  useEffect(()=>{
    // useEffect здесь для того чтобы очищать строку поиска если user кликнул назад в браузере
    document.querySelector('#q').value = searchRequest;
  },[searchRequest]);
  
  const submit = useSubmit();// хук для принудительного Submit формы при любом изменении поискового запроса
 
  const searching = navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "searchRequest"
    ); //это для класса запускающего спиннер при загрузке. navigation.location появляется когда app переходит к новому url и загружает дааные для него
  return (
      <>
        <div id="sidebar">
          <h1>React Router Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                className={searching ? "loading" : ""}
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="searchRequest"
                defaultValue = {searchRequest}
                onChange = {(event)=>{
                  const isFirstSearch = searchRequest == null;// устанавливаем проверку на первый поиск: Если (searchRequest == null) равна true
                  submit(event.currentTarget.form,{
                    replace: !isFirstSearch,// документации об функциональности изменения истории я не нашел. Но данное св-во обьекта
                  });
                }}
              />
              <div
                id="search-spinner"
                aria-hidden
                hidden={!searching}
              />
              <div
                className="sr-only"
                aria-live="polite"
              ></div>
            </Form>
            <Form method="post">
            <button type="submit">New</button>
          </Form>
          </div>
          <nav>
              {/* <li>
                <NavLink to={`/fun`}>Another page</NavLink>
              </li> */}
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  {//Заменили эту запись с Link на NavLink и теперь у нас отображается стиль для активной линки
                  /* <Link to={`contacts/${contact.id}`}>
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </Link> */}
                  <NavLink
                    to={`contacts/${contact.id}`}
                    className={({ isActive, isPending }) =>
                      isActive
                        ? "active"
                        : isPending
                        ? "pending"
                        : ""
                    }
                  >
                    {contact.first || contact.last ? (
                      <>
                        {contact.first} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite && <span>★</span>}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
          </nav>
        </div>
        <div id="detail" className={
          navigation.state === "loading" ? "loading" : ""
        }>
          {/* Вот этот   <Outlet /> помогает рендерить содержимое внутри Компоненты   <Root />, без использования css grid*/}
          <Outlet />
        </div>
      </>
    );
  }