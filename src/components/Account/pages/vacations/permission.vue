<template>
  <app-base-sheet>
    <v-card flat>
      <v-card-title class="justify-space-between">
        <span>Настройка ролей</span>
        <v-btn text small color="error">
          Включить режим просмотра
        </v-btn>
      </v-card-title>
      <v-card-text>
        <setting-row description="Администраторы назначаются только владельцем пространства" label="Администраор">
          <permission-row>
            <template v-slot:default>
              <v-checkbox
                  class="mt-0"
                  hide-details
                  label="Управление игроками"
              />
            </template>
            <template v-slot:description>
              <ul>
                <li>Создание</li>
                <li>Редактирование</li>
                <li>Удаление</li>
                <li>Назначение должностей, команд</li>
              </ul>
            </template>
          </permission-row>
          <permission-row>
            <template v-slot:default>
              <v-checkbox
                  class="mt-0"
                  hide-details
                  label="Управление струтурой"
              />
            </template>
            <template v-slot:description>
              <ul>
                <li>Создание и редактирование должностей</li>
                <li>Создание и редактирование команд</li>
                <li>Создание и редактирование задач</li>
                <li>Назначение тимлидеров</li>
              </ul>
            </template>
          </permission-row>
          <permission-row>
            <template v-slot:default>
              <v-checkbox
                  class="mt-0"
                  hide-details
                  label="Управление пространством"
              />
            </template>
            <template v-slot:description>
              <ul>
                <li>Изменение настроек пространства</li>
                <li>Изменение шаблона для отпусков</li>
                <li>Изменение настроек ролей</li>
              </ul>
            </template>
          </permission-row>
          <permission-row>
            <template v-slot:default>
              <v-checkbox
                  class="mt-0"
                  hide-details
                  label="Управление графиком отпусков"
              />
            </template>
            <template v-slot:description>
              <ul>
                <li>Создание</li>
                <li>Редактирование</li>
                <li>Удаление</li>
                <li>Управление праздничными днями</li>
              </ul>
            </template>
          </permission-row>
          <permission-row>
            <template v-slot:default>

              <v-checkbox
                  class="mt-0"
                  hide-details
                  label="Добавление / редактирование / удаление отпусков"
              />
            </template>
            <template v-slot:description>
              <ul>
                <li>Позволяет создавать, редактировать и удалять отпуска в профиле сотрудника</li>
              </ul>
            </template>
          </permission-row>
          <permission-row>
            <template v-slot:default>
              <v-checkbox
                  class="mt-0"
                  hide-details
                  label="Утверждение / отклонение отпусков"
              />
            </template>
            <template v-slot:description>
              <ul>
                <li>Позволяет утверждать, отклонять и отменять решение по отправленным отпускам</li>
              </ul>
            </template>
          </permission-row>
        </setting-row>
        <setting-row description="Роль присваивается всем лидерам команд" label="Тимлидер">
          <permission-row>
            <template v-slot:default>
              <v-checkbox
                  class="mt-0"
                  hide-details
                  label="Управление игроками"
              />
            </template>
            <template v-slot:description>
              <ul>
                <li>Создание</li>
                <li>Редактирование</li>
                <li>Удаление</li>
                <li>Назначение должностей, команд</li>
              </ul>
            </template>
          </permission-row>
          <permission-row>
            <template v-slot:default>
              <v-checkbox
                  class="mt-0"
                  hide-details
                  label="Управление струтурой"
              />
            </template>
            <template v-slot:description>
              <ul>
                <li>Создание и редактирование должностей</li>
                <li>Создание и редактирование команд</li>
                <li>Создание и редактирование задач</li>
                <li>Назначение тимлидеров</li>
              </ul>
            </template>
          </permission-row>
          <permission-row>
            <template v-slot:default>
              <v-checkbox
                  class="mt-0"
                  hide-details
                  label="Управление пространством"
              />
            </template>
            <template v-slot:description>
              <ul>
                <li>Изменение настроек пространства</li>
                <li>Изменение шаблона для отпусков</li>
                <li>Изменение настроек ролей</li>
              </ul>
            </template>
          </permission-row>
          <permission-row>
            <template v-slot:default>
              <v-checkbox
                  class="mt-0"
                  hide-details
                  label="Управление графиком отпусков"
              />
            </template>
            <template v-slot:description>
              <ul>
                <li>Создание</li>
                <li>Редактирование</li>
                <li>Удаление</li>
                <li>Управление праздничными днями</li>
              </ul>
            </template>
          </permission-row>
          <permission-row>
            <template v-slot:default>

              <v-checkbox
                  class="mt-0"
                  hide-details
                  label="Добавление / редактирование / удаление отпусков"
              />
            </template>
            <template v-slot:description>
              <ul>
                <li>Позволяет создавать, редактировать и удалять отпуска в профиле сотрудника</li>
              </ul>
            </template>
          </permission-row>
          <permission-row>
            <template v-slot:default>
              <v-checkbox
                  class="mt-0"
                  hide-details
                  label="Утверждение / отклонение отпусков"
              />
            </template>
            <template v-slot:description>
              <ul>
                <li>Позволяет утверждать, отклонять и отменять решение по отправленным отпускам</li>
              </ul>
            </template>
          </permission-row>
        </setting-row>
      </v-card-text>
    </v-card>
  </app-base-sheet>
</template>

<script>
import AppBaseSheet from "@/layouts/AppBaseSheet";
import SettingRow from "@/components/Account/setting-row";
import PermissionRow from "@/components/Account/permission-row";
import Template from "@/components/Account/pages/vacations/template";

export default {
  name: "permission",
  components: {Template, PermissionRow, SettingRow, AppBaseSheet},
  userGroups: [
    {text: 'Все', value: 'all'},
    {text: 'Моя и вложенные команды *', value: 'subTeams'},
    {text: 'Только моя команда *', value: 'team'},
    {text: 'Запрещено', value: 'none'},
  ],
  data() {
    return {
      readonly: false,
      check: false
    }
  }
}
</script>

