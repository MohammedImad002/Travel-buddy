<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep destination recommendations on the existing Travel Buddy AI request path so all recommendation screens share gateway behavior and errors.
- Keep universal safety guidance and emergency calling client-side so urgent information remains available when AI access is paused.
- Synchronize the selected trip across hook instances with the in-page trip-change event so global controls always use the current destination.
- Protect metered Google Maps location lookup with signed-in server functions, while device GPS access remains an explicit user action.
